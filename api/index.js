require('dotenv').config();
import { CONST } from '../const.js';
import _ from 'lodash';
import dayjs from 'dayjs';
const uuidv4 = require('uuid/v4');
const express = require("express");
const app = express();

app.use(express.json())
app.use(express.urlencoded({
	extended: true
}));

const logger = require("../server/logger").logger;
const axiosBase = require("../server/axios").axiosBase;
const axios = require("../server/axios").axios;

app.use(function (req, res, next) {
	logger.debug('[Express] START TIME:', Date.now());
	logger.debug("[Express] METHOD: ", req.method, "URL: ", req.url);
	next()
});

app.get("/profile", function (req, res, next) {

	axiosBase.all([
		axios.get(`/organization/${req.session.passport.user.organization_id}`),
		axios.get(`/school/${req.session.passport.user.organization_id}`),
		axios.get(`/organization/${req.session.passport.user.organization_id}/user`)
	]).then(axiosBase.spread((res1, res2, res3) => {
		let resData = {
			organization_id: _.get(res1, 'data.organization_id'),
			organization_name: _.get(res1, 'data.organization_name'),
			organization_name_kana: _.get(res1, 'data.organization_name_kana'),
			prefecture: _.get(res1, 'data.prefecture'),
			city: _.get(res1, 'data.city'),
			address: _.get(res1, 'data.address'),
			mail_address: _.get(res3, 'data.mail_address'),
			homepage: _.get(res1, 'data.homepage'),
			school_id: _.get(res2, 'data.school_id'),
			school_type: _.get(res2, 'data.school_type'),
			student_number: _.get(res2, 'data.student_number'),
			scholarship_request: _.get(res2, 'data.scholarship_request'),
			internship_request: _.get(res2, 'data.internship_request'),
			practice_request: _.get(res2, 'data.practice_request'),
			user_id: _.get(res3, 'data.user_id'),
		};
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.get("/profile/password", function (req, res, next) {

	axiosBase.all([
		axios.get(`/organization/${req.session.passport.user.organization_id}/user`)
	]).then(axiosBase.spread((res1) => {
		let resData = _.get(res1, 'data.password');
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.put("/profile/password", function (req, res, next) {
	let user = {
		"user_id": req.session.passport.user.user_id,
		"password": req.body.password,
	};
	axiosBase.all([
		axios.put(`/user/${req.session.passport.user.user_id}`, _.omitBy(user, _.isNil))
	]).then(axiosBase.spread((res1) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.put("/profile", function (req, res, next) {
	let organization = {
		"organization_name": req.body.organization_name,
		"organization_name_kana": req.body.organization_name_kana,
		"prefecture": req.body.prefecture,
		"city": req.body.city,
		"address": req.body.address,
		"homepage": req.body.homepage,
	};
	let school = {
		"school_id": req.session.passport.user.organization_id,
		"school_type": req.body.school_type,
		"student_number": req.body.student_number,
		"scholarship_request": req.body.scholarship_request,
		"internship_request": req.body.internship_request,
		"practice_request": req.body.practice_request,
	};
	let user = {
		"user_id": req.body.user_id,
		"organization_id": req.session.passport.user.organization_id,
		"mail_address": req.body.mail_address,
	};
	axiosBase.all([
		axios.put(`/organization/${req.session.passport.user.organization_id}`, _.omitBy(organization, _.isNil)),
		axios.put(`/school/${req.session.passport.user.organization_id}`, _.omitBy(school, _.isNil)),
		axios.put(`/user/${req.body.user_id}`, _.omitBy(user, _.isNil))
	]).then(axiosBase.spread((res1, res2, res3) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/fair", function (req, res, next) {

	axios.get(`/fair`).then(function (response) {
		let resData = _.map(
			_.filter(response.data, (dt) => {
				return dayjs().isBefore(dayjs(dt.plan_end_at).add(1, 'day'))
			}), (data) => {
				return {
					fair_id: data.fair_id,
					hospital_id: data.hospital_id,
					organization_name: _.get(data, 'organization.organization_name'),
					address: _.get(data, 'organization.prefecture') + _.get(data, 'organization.city'),
					hospital_type: _.get(data, 'organization.hospital.hospital_type'),
					fair_type: _.map(_.get(data, 'fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
					plan_start_at: data.plan_start_at,
					plan_end_at: data.plan_end_at,
					fair_status: data.fair_status,
					application_count:
						_.filter(
							_.get(data, 'fair_applications'), (dt) => {
								return dt.application_status !== CONST.application_status.CANCEL.value
							}
						).length,
					isApplied:
						!_.isEmpty(_.filter(
							_.get(data, 'fair_applications'), (dt) => {
								return dt.application_status !== CONST.application_status.CANCEL.value
									&& dt.application_status !== CONST.application_status.REJECT.value
									&& dt.school_id === req.session.passport.user.organization_id
							}
						)),
					applied_application_id:
						_.get(
							_.filter(
								_.get(data, 'fair_applications'), (dt) => {
									return dt.application_status !== CONST.application_status.CANCEL.value
										&& dt.application_status !== CONST.application_status.REJECT.value
										&& dt.school_id === req.session.passport.user.organization_id
								}
							),
							'0.application_id'
						),
					applied_application:
						_.get(
							_.filter(
								_.get(data, 'fair_applications'), (dt) => {
									return dt.school_id === req.session.passport.user.organization_id
								}
							),
							'0'
						),

				}
			});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/fair/:fair_id", function (req, res, next) {
	axiosBase.all([
		axios.get(`/fair/${req.params.fair_id}`),
		axios.get(`/fair/${req.params.fair_id}/detail`),
		axios.get(`/fair/${req.params.fair_id}/application`),
	]).then(axiosBase.spread((res1, res3, res4) => {
		const plan_start_at = _.get(res1, 'data.plan_start_at') ? dayjs(_.get(res1, 'data.plan_start_at')).format("YYYY-MM-DD") : null;
		const plan_end_at = _.get(res1, 'data.plan_end_at') ? dayjs(_.get(res1, 'data.plan_end_at')).format("YYYY-MM-DD") : null;
		let resData = {
			"fair_id": _.get(res1, 'data.fair_id'),
			"organization_name": _.get(res1, 'data.organization.organization_name'),
			"fair_type": _.map(_.get(res1, 'data.fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
			"plan_start_at": plan_start_at,
			"plan_end_at": plan_end_at,
			"fair_status": _.get(res1, 'data.fair_status'),
			"append": _.map(_.omitBy(_.get(res3, 'data'), _.isNil), (dt) =>{
				return {
					id: uuidv4(),
					hospital_id: _.get(dt, "append_info.hospital_id"),
					append_information_type: _.get(dt, "append_info.append_information_type"),
					recruiting_period_start: _.get(dt, "append_info.recruiting_period_start"),
					recruiting_period_end: _.get(dt, "append_info.recruiting_period_end"),
					recruiting_job_type: _.get(dt, "append_info.recruiting_job_type"),
					comment: _.get(dt, "append_info.comment"),
					various_matters: _.get(dt, "append_info.various_matters"),
					other: _.get(dt, "append_info.other"),
					hospital_scholarship: _.get(dt, "append_info.hospital_scholarship"),
					hospital_intership: _.get(dt, "append_info.hospital_intership"),
					hospital_practice: _.get(dt, "append_info.hospital_practice"),
					hospital_fair: _.get(dt, "append_info.hospital_fair"),
				}
			}),
			"fair_application": _.omitBy(_.get(res4, 'data'), _.isNil),
			"applied_application":
				_.get(
					_.filter(
						_.get(res4, 'data'), (dt) => {
							return dt.school_id === req.session.passport.user.organization_id
						}
					),
					'0'
				),
		};

		res.send(_.omitBy(resData, _.isNil));

	})).catch(function (error) {
		next(error);
	});
});

app.get("/school_activity", function (req, res, next) {

	axios.get(`/schoolActivity`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				organization_id: data.organization_id,
				organization_name: data.organization_name,
				address: data.prefecture + data.city,
				homepage: data.homepage,
				school_type: _.get(data, 'school.school_type'),
				scholarship_request: _.get(data, 'school.scholarship_request'),
				internship_request: _.get(data, 'school.internship_request'),
				practice_request: _.get(data, 'school.practice_request'),
				fair_application_status: // 説明会申込状況 = 申込中の申込の有無
					_.filter(
						_.get(data, 'school.fair_applications'), (dt) => {
							return dt.application_status === CONST.application_status.APPLYING.value;
						}
					).length > 0,
				fair_application_count: // 説明会申込回数 = 説明会申込した数
					_.filter(
						_.get(data, 'school.fair_applications'), (dt) => {
							return dt.application_status !== CONST.application_status.CANCEL.value;
						}
					).length,
				channel_participation_count: // チャンネル参加数 = 自分が参加した完了イベント数
					_.filter(
						_.get(data, 'event_members'), (dt) => {
							return _.get(dt, "online_event.event_type") !== CONST.event_type.SIMPLE.value
							&& (
								_.get(dt, "online_event.event_status") === CONST.event_status.OFFICIAL.value
								|| _.get(dt, "online_event.event_status") === CONST.event_status.DONE.value
								|| _.get(dt, "online_event.event_status") === CONST.event_status.DONE_NO_PAY.value
							)
						}
					).length,
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/hospital_activity", function (req, res, next) {

	axios.get(`/hospitalActivity`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				organization_id: data.organization_id,
				organization_name: data.organization_name,
				address: data.prefecture + data.city,
				homepage: data.homepage,
				hospital_type: _.get(data, 'hospital.hospital_type'),
				fair_open_status:
					!_.isEmpty(
						_.filter(
							_.get(data, 'fair'),
							(dt) => dt.fair_status === CONST.fair_status.RECRUITING.value
						)
					), // true: 募集中 false: 募集してない
				fair_count: _.filter(
					_.get(data, 'fair'),
					(dt) => dt.fair_status !== CONST.fair_status.CANCEL.value
				).length,
				// channel_participation_status:
				// 	_.filter(
				// 		_.get(data, 'event_members'), (dt) => {
				// 			return _.get(dt, "online_event.event_status") === CONST.event_status.OFFICIAL.value
				// 		}
				// 	).length > 0,
				channel_participation_count:
					_.filter(
						_.get(data, 'event_members'), (dt) => {
							return _.get(dt, "online_event.event_type") !== CONST.event_type.SIMPLE.value
							&& (
								_.get(dt, "online_event.event_status") === CONST.event_status.OFFICIAL.value
								|| _.get(dt, "online_event.event_status") === CONST.event_status.DONE.value
								|| _.get(dt, "online_event.event_status") === CONST.event_status.DONE_NO_PAY.value
							)
						}
					).length,
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/fairApplication", function (req, res, next) {
	const applying = CONST.application_status.APPLYING.value;
	const subscribed = CONST.application_status.SUBSCRIBED.value;
	const reject = CONST.application_status.REJECT.value;
	axios.get(`/fairApplication?school_id=${req.session.passport.user.organization_id}&application_status=${applying},${subscribed},${reject}`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				application_id: _.get(data, 'application_id'),
				school_name: _.get(data, 'organization.organization_name'),
				application_datetime: _.get(data, 'application_datetime'),
				application_status: _.get(data, 'application_status'),
				fair_format: _.get(data, 'format'),
				estimate_participant_number: _.get(data, 'estimate_participant_number'),
				organization_name: _.get(data, 'fair.organization.organization_name'),
				fair_type: _.map(_.get(data, 'fair.fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
				plan_start_at: _.get(data, 'fair.plan_start_at'),
				plan_end_at: _.get(data, 'fair.plan_end_at'),
				fair_status: _.get(data, 'fair.fair_status'),
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/fairApplication/:application_id", function (req, res, next) {
	axiosBase.all([
		axios.get(`/fairApplication/${req.params.application_id}`),
	]).then(axiosBase.spread((res1) => {
		axiosBase.all([
			axios.get(`/fair/${res1.data.fair_id}`),
		]).then(axiosBase.spread((res2) => {

			let resData = {
				fair_application: res1.data,
				fair: res2.data,
			}
			resData.fair.fair_type = _.map(_.get(resData, 'fair.fair_type'), (dt) => { return _.get(dt, 'fair_type') });
			res.send(_.omitBy(resData, _.isNil));

		})).catch(function (error) {
			next(error);
		});

	})).catch(function (error) {
		next(error);
	});
});

app.post("/fairApplication", function (req, res, next) {
	let uuid4 = uuidv4();
	let application = {
		application_id: uuid4,
		fair_id: req.body.fair_id,
		school_id: req.body.school_id,
		estimate_participant_number: req.body.estimate_participant_number,
		format: req.body.format,
		comment: req.body.comment,
	};
	axiosBase.all([
		axios.post(`/fairApplication`, _.omitBy(application, _.isNil)),
	]).then(axiosBase.spread((res1) => {
		res.send({
			"application_id": res1.data.application_id
		});
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.put("/fairApplication", function (req, res, next) {
	let application = {
		application_id: req.body.application_id,
		fair_id: req.body.fair_id,
		school_id: req.body.school_id,
		application_status: req.body.application_status,
		estimate_participant_number: req.body.estimate_participant_number,
		format: req.body.format,
		comment: req.body.comment,
	};
	axiosBase.all([
		axios.put(`/fairApplication/${req.body.application_id}`, _.omitBy(application, _.isNil)),
	]).then(axiosBase.spread((res1) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/channel", function (req, res, next) {
	axiosBase.all([
		axios.get(`/onlineEvent`),
	]).then(axiosBase.spread((res1) => {
		// ※自分が参加するイベントのみ取得
		let resData = _.filter(_.get(res1, "data"), (dt) => {
			return !_.isEmpty(_.filter(_.get(dt, "event_member"), (dt2) => {
				return _.get(dt2, "organization_id") === req.session.passport.user.organization_id;
			}))
		});

		resData = _.map(resData, (dt) => {
			return {
				event_id: dt.event_id,
				event_type: dt.event_type,
				channel_mode: dt.channel_status,
				owner_name: _.get(_.find(_.get(dt, "event_member"), (dt2) => {
					return dt2.member_role === CONST.member_role.OWNER.value;
				}), "organization.organization_name"),
				member_count: dt.event_member.length,
				organization_name: _.get(dt, "fair.organization.organization_name"),
				organization_type: _.get(dt, "fair.organization.organization_type"),
				fair_type: _.map(_.get(dt, 'fair.fair_type'), (dt2) => { return _.get(dt2, 'fair_type') }),
				event_status: dt.event_status,
				start_at: dt.start_at,
				end_at: dt.end_at
			}
		})
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.get("/channel/:event_id", function (req, res, next) {
	axiosBase.all([
		axios.get(`/onlineEvent/${req.params.event_id}`),
		axios.get(`/eventMember/${req.params.event_id}`),
	]).then(axiosBase.spread((res1, res2) => {
		const fair_id = _.get(res1, 'data.fair_id');
		if (!fair_id) {
			let resData = {
				"event": _.get(res1, 'data'),
				"event_member": _.get(res2, 'data'),
			};
			res.send(_.omitBy(resData, _.isNil));
			return;
		}

		axiosBase.all([
			axios.get(`/fair/${fair_id}`),
			axios.get(`/fairApplication/${fair_id}/application`),
		]).then(axiosBase.spread((res3, res4) => {
			let resData = {
				"event": _.get(res1, 'data'),
				"event_member": _.get(res2, 'data'),
				"fair": _.get(res3, 'data'),
				"application": _.get(res4, 'data'),
			};
			res.send(_.omitBy(resData, _.isNil));
			return;


		})).catch(function (error) {
			next(error);
		});
	})).catch(function (error) {
		next(error);
	});
});

app.get("/notification", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.get(`/notification/${organization_id}`).then(function (response) {
		let resData = {
			unread: _.some(response.data, {confirm_status: CONST.read_status.UNREAD.value}),
			notification: _.orderBy(_.map(response.data, (data) => {
				return {
					notification_id: _.get(data, 'notification_id'),
					title: _.get(data, 'title'),
					// content: _.get(data, 'content'),
					notification_at: _.get(data, "notification_at"),
				}
			}), 'notification_at', 'desc')
		}
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/notification/:notification_id", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.get(`/notification/${organization_id}/${req.params.notification_id}`).then(function (response) {
		let resData = response.data;
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/unread_notification", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.get(`/notification/${organization_id}`).then(function (response) {
		let resData = {
			unread: _.some(response.data, {confirm_status: CONST.read_status.UNREAD.value}),
			notification: _.orderBy(_.filter(response.data, (data) => {
				return data.confirm_status === CONST.read_status.UNREAD.value;
			}), 'notification_at', 'desc')
		}
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.put("/notification", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.put(`/notification/${organization_id}`).then(function (response) {
		res.end();
	}).catch(function (error) {
		next(error);
	});
});

app.get("/hospital", function (req, res, next) {
	axiosBase.all([
		axios.get(`/hospital`),
	]).then(axiosBase.spread((res1) => {

		res.send(_.filter(_.get(res1, "data")));
	})).catch(function (error) {
		next(error);
	});
});


app.post("/questionary", function (req, res, next) {
	const uuid = uuidv4();
	const questionary = {
		'questionary_id': uuid,
		'school_id': req.session.passport.user.organization_id,
		'answered_datetime': dayjs().format("YYYY-MM-DD H:m:s"),
		'desire_start_at': req.body.desire_start_at,
		'desire_end_at': req.body.desire_end_at,
		'comment': req.body.comment,
		'questionaryFairType': _.map(req.body.append_information, (dt) => {
			return {
				'questionary_id': uuid,
				'fair_type': dt
			}
		}),
		'questionaryHospital':_.map(req.body.hospital_id, (dt) => {
			return {
				'questionary_id': uuid,
				'hospital_id': dt
			}
		}),
		'questionaryPlace':_.map(req.body.prefecture, (dt) => {
			return {
				'questionary_id': uuid,
				'place': dt
			}
		}),
		'questionaryHospitalType':_.map(req.body.hospital_type, (dt) => {
			return {
				'questionary_id': uuid,
				'hospital_type': dt
			}
		}),
	}

	axiosBase.all([
		axios.post(`/questionary`, questionary),
	]).then(axiosBase.spread((res1) => {

		res.send(_.filter(_.get(res1, "data")));
	})).catch(function (error) {
		next(error);
	});
});

var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

// Endpoint to generate access token
app.get('/token', function (request, response, next) {
	var identity = request.query.identity;
	var room = request.query.room;

	// Create an access token which we will sign and return to the client,
	// containing the grant we just created
	var token = new AccessToken(
		process.env.TWILIO_ACCOUNT_SID || 'AC43eff80459b9b0429c0d2b0395a10d6c',
		process.env.TWILIO_API_KEY || 'SK9b2874d9a154f16da424dc90bb7ce134',
		process.env.TWILIO_API_SECRET || 'Paj7iWmsMpEoOjz9UgHdcowx3P5HdNxb'
	);

	// Assign the generated identity to the token
	token.identity = identity;

	const grant = new VideoGrant({
		room: room
	});
	// Grant token access to the Video API features
	token.addGrant(grant);

	// Serialize the token to a JWT string and include it in a JSON response
	response.send({
		identity: identity,
		token: token.toJwt()
	});
});

function logErrors (err, req, res, next) {
	logger.error(err);
	next(err);
}

function errorHandler (err, req, res, next) {
	res.status(err.status).send({
		error: err.data
	});
}

app.use(logErrors);
app.use(errorHandler);

module.exports = {
	path: "/api/",
	handler: app
};
