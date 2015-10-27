Meteor.publish('bikes', function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Bikes.find();
  } else if (this.userId) {
    return Bikes.find({
      locationId: Meteor.users.findOne(this.userId).profile.locationId,
      active: true
    });
  } else {
    this.ready();
  }
});

Meteor.publish('radios', function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Radios.find();
  } else if (this.userId) {
    return Radios.find({
      locationId: Meteor.users.findOne(this.userId).profile.locationId,
      active: true
    });
  } else {
    this.ready();
  }
});

Meteor.publish('locations', function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Locations.find();
  } else if (this.userId) {
    return Locations.find({_id: Meteor.users.findOne(this.userId).profile.locationId});
  } else {
    return Locations.find();
  }
});

Meteor.publish('shifts', function(limit) {
	if (Roles.userIsInRole(this.userId, ['admin'])) {
		return Shifts.find({}, {limit: limit, sort: {submitted: -1}});
	} else if (Roles.userIsInRole(this.userId, ['manager'])) {
		return Shifts.find(
        {locationId: Meteor.users.findOne(this.userId).profile.locationId},
        {
          limit: limit,
          sort: {submitted: -1}
        }
      );
	} else {
		this.ready();
	};
});

Meteor.publish('comments', function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Shifts.find({comments: {$ne:''}}, {fields: {'comments': 1, 'bikeId': 1, 'userId': 1},
     sort: {'submitted': -1}});
  } else if (Roles.userIsInRole(this.userId, ['manager'])) {
    return Shifts.find({locationId: Meteor.users.findOne(this.userId).profile.locationId, coments: {$ne:''}},
      {fields: {'comments': 1, 'bikeId': 1, 'userId': 1},
      sort: {'submitted': -1}});
  } else {
    this.ready();
  };
});

Meteor.publish('userData', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.users.find({}, {fields: {'emails': 1, 'profile': 1, 'roles': 1}});
  } else if (Roles.userIsInRole(this.userId, ['manager'])) {
    return Meteor.users.find({
      "profile.locationId": Meteor.users.findOne(this.userId).profile.locationId
    },
    { fields: {'emails': 1, 'profile': 1, 'roles': 1} });
  } else if (this.userId) {
    return Meteor.users.find({
      "profile.locationId": Meteor.users.findOne(this.userId).profile.locationId,
      "profile.active": true,
      'roles': 'biker'
    },
    { fields: {'emails': 1, 'profile': 1} });
  } else {
    this.ready();
  }
});

Meteor.publish('roles', function() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.roles.find();
  } else if (Roles.userIsInRole(this.userId, ['manager'])) {
    return Meteor.roles.find({name: {$ne: 'admin'}});
  } else {
    this.ready();
  }
});

Meteor.publish('requests', function() {
  if (Roles.userIsInRole(this.userId, ['admin', 'manager'])) {
    return Requests.find({
      locationId: Meteor.users.findOne(this.userId).profile.locationId,
      requestDate: {$gt: new Date()}
    });
  } else if (this.userId) {
    return Requests.find({
      userId: this.userId,
      requestDate: {$gte: new Date()}
    });
  } else {
    this.ready();
  }
});

Meteor.publish('rates', function() {
 if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Rates.find();
  } else if (this.userId) {
    return Rates.find({
      locationId: Meteor.users.findOne(this.userId).profile.locationId,
      scheduleDate: {$gte: new Date()}
    });
  } else {
    this.ready();
  }
});

Accounts.onCreateUser(function(options, user) {
  options.roles = ['biker'];
  options.profile.active = true;
  _.extend(user, {
    profile: options.profile,
    roles: options.roles
  });

  Meteor.setTimeout(function() {
    Accounts.sendVerificationEmail(user._id);
  }, 2 * 1000);

  return user;
});
