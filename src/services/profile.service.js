// redux
import {store} from '../redux/store';
import * as Actions from '../redux/actions';
// id generator
import UUIDGenerator from 'react-native-uuid-generator';
// datasource
import * as dbProfile from '../datasource/profile.datasource';
// service
import * as servicePayslip from '../services/payslip.service';

export const createProfile = user => {
  return new Promise((resolve, reject) => {
    generateUUID().then(uuid => {
      let profId = uuid;
      generateUUID().then(uuid => {
        let dbId = uuid;

        let newProfile = {
          _id: dbId,
          profileId: profId,
          name: user.name,
          rank: {
            rankName: user.rank.rankName,
            rankPay: user.rank.rankPay,
          },
          divAndUnit: user.divAndUnit,
          troop: user.troop,
          vocation: user.vocation,
        };
        dbProfile
          .registerProfile(newProfile)
          .then(resp => {
            // success registered

            // retrieve profile to populate in drawable
            dbProfile
              .retrieveUserProfile()
              .then(resp => {
                console.log(JSON.parse(JSON.stringify(resp)));
                let profile = JSON.parse(JSON.stringify(resp));
                let name = profile[0].name;
                let rank = profile[0].rank.rankName;
                let vocation = profile[0].vocation;
                store.dispatch(Actions.set_profile({name, rank, vocation}));
                resolve();
              })
              .catch(err => {
                // failed to retrieve user profile
                // TODO firebase crashlytics (crash report)
                reject(err);
              });
          })
          .catch(err => {
            // failed to register
            // TODO firebase crashlytics (crash report)
            reject(err);
          });
      });
    });
  });
};

export const retrieveProfile = () => {
  return new Promise((resolve, reject) => {
    dbProfile
      .retrieveUserProfile()
      .then(resp => {
        // success retrieve profile
        resolve(JSON.parse(JSON.stringify(resp)));
      })
      .catch(err => {
        // failed to retrieve profile
        // TODO firebase crashlytics (crash report)
        reject(err);
      });
  });
};

export const updateProfile = data => {
  return new Promise((resolve, reject) => {
    dbProfile
      .retrieveUserProfile()
      .then(resp => {
        let profileObj = JSON.parse(JSON.stringify(resp));
        let _id = profileObj[0]._id;

        // update profile
        let updatedProfile = {
          _id: profileObj[0]._id,
          name: data.name,
          rank: {
            rankName: data.rank.rankName,
            rankPay: data.rank.rankPay,
          },
          vocation: data.vocation,
        };

        dbProfile
          .updateProfile(updatedProfile)
          .then(resp => {
            // success
            // update login state in redux
            let respObj = JSON.parse(JSON.stringify(resp));
            let name = respObj[0].name;
            let rank = respObj[0].rank.rankName;
            let vocation = respObj[0].vocation;
            store.dispatch(Actions.update_profile({name, rank, vocation}));
            servicePayslip
              .recalculatePayslipTemplate(updatedProfile, 'update')
              .then(resp => {
                resolve(JSON.parse(JSON.stringify(resp)));
              })
              .catch(err => {
                // failed to recalculate payslip template
                // TODO firebase crashlytics (crash report)
                reject(err);
              });
          })
          .catch(err => {
            //  failed to update profile
            // TODO firebase crashlytics (crash report)
            reject(err);
          });
      })
      .catch(err => {
        // failed to retrieve user profile
        // TODO firebase crashlytics (crash report)
        reject(err);
      });
  });
};

export const deleteProfile = () => {
  return new Promise((resolve, reject) => {
    dbProfile
      .deleteAllProfile()
      .then(resp => {
        // success delete
        // update login state in redux
        resolve(JSON.parse(JSON.stringify(resp)));
      })
      .catch(err => {
        // failed to delete profile
        // TODO firebase crashlytics (crash report)
        reject(err);
      });
  });
};

const generateUUID = () => {
  return new Promise((resolve, reject) => {
    UUIDGenerator.getRandomUUID()
      .then(uuid => {
        resolve(uuid);
      })
      .catch(err => {
        // failed to generate UUID
        // TODO firebase crashlytics (crash report)
        reject(err);
      });
  });
};
