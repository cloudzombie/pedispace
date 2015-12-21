Template.requestsCal.onCreated(function() {
	var instance = this;
	instance.autorun(() => {
		instance.subscribe('shiftTypes');
		instance.subscribe('requests');
		instance.subscribe('rates');
		if (Roles.userIsInRole(Meteor.userId(), ['manager'])) {
			instance.subscribe('bikes');
			instance.subscribe('riders');
		}
	});
	instance.scheduleDates = new ReactiveVar([]);
	instance.setNewDateRange = function(initialDate, finalDate) {
		var scheduleRange = [];
		var numDays = finalDate.diff(initialDate, 'day');
			for (var i = 0; i <= numDays; i++) {
			var pushDate = initialDate.clone().add(i, 'day');
			scheduleRange.push({scheduleDate: pushDate.clone()});
		}
		instance.scheduleDates.set(scheduleRange);
	};
});

Template.requestsCal.onRendered(function() {
	var instance = this;
	$('.datepicker').datepicker({
		format: "mm/dd/yyyy",
		autoclose: true,
		orientation: 'top'
	});
	var thisSat = moment().format("MM/DD/YYYY");
	$('[name=initialDate]').val(thisSat);
	var nextWeek = moment().day(7).format("MM/DD/YYYY");
	$('[name=finalDate]').val(nextWeek);
	var initialDate = moment(instance.$('[name=initialDate]').val(), 'MM/DD/YYYY');
	var finalDate = moment(instance.$('[name=finalDate]').val(), 'MM/DD/YYYY');
	instance.setNewDateRange(initialDate,finalDate);
});

Template.requestsCal.helpers({
	scheduleDates() {
		return Template.instance().scheduleDates.get();
	},
	scheduleDateNice(scheduleDate) {
		return moment(scheduleDate).format('MMMM DD, YYYY')
	},
	shiftTypes() {
		var businessId = Meteor.user().profile.businessId;
		return ShiftTypes.find({businessId: businessId});
	},
	dateNum(scheduleDate) {
		return scheduleDate.valueOf();
	}
});

Template.requestsCal.events({
	'change .datepicker' (event, instance) {
		var initialDate = moment(instance.$('[name=initialDate]').val(), 'MM/DD/YYYY');
		var finalDate = moment(instance.$('[name=finalDate]').val(), 'MM/DD/YYYY');
		instance.setNewDateRange(initialDate,finalDate);
	}
});

Template.shiftComments.helpers({
	request() {
		var request = Requests.findOne({
			userId: Meteor.userId(),
			scheduleDate: this.scheduleDate.toDate(),
			shiftTypeId: this.shiftTypeId
		});
		if (request)
			return request;
		return false;
	},
	rate() {
		var rate = Rates.findOne({
			businessId: Meteor.user().profile.businessId,
			scheduleDate: this.scheduleDate.toDate(),
			shiftTypeId: this.shiftTypeId
		});
		if (rate)
			return rate;
		return false;
	},
});

Template.setRates.helpers({
	shiftTypes() {
		return ShiftTypes.find({
			businessId: Meteor.user().profile.businessId
		});
	},
	dateNum(scheduleDate) {
		return scheduleDate.valueOf();
	},
	scheduleDateNice(scheduleDate) {
		return moment(scheduleDate).format('MMMM DD, YYYY')
	},
});