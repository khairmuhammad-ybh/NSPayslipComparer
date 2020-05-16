// Redux
import {store} from '../redux/store';
import * as Actions from '../redux/actions';

// uuid
import {v4 as uuidv4} from 'uuid';

// database
import * as dbProfile from '../database/profile.database';
import {profileDbOptions} from '../database/dbconfig.database';
import {profileSchema} from '../database/dbModel.database';

export const createProfile = user => {
  return new Promise((resolve, reject) => {
    let newProfile = {
      _id: uuidv4(),
      profileId: uuidv4(),
      name: user.name,
      rank: {
        rankName: user.rank.rankName,
        rankPay: user.rank.rankPay,
      },
      divAndUnit: user.divAndUnit,
      troop: user.troop,
      payslipOCR: '[]',
      payslipManual: '[]',
    };
    dbProfile
      .registerProfile(newProfile)
      .then(resp => {
        // success registered
        // console.log(`success register: ${resp}`);
        // console.log(resp);

        // update login state in redux
        store.dispatch(Actions.update_first_launch());
        resolve(resp);
      })
      .catch(err => {
        // failed to register
        // console.log(`In profile.service err (registerProfile): ${err}`);
        reject(err);
      });
  });
};

export const retrieveProfile = () => {
  return new Promise((resolve, reject) => {
    dbProfile
      .retrieveUserProfile()
      .then(resp => {
        // success registered
        // console.log(`success retrieve: ${resp}`);
        // console.log(JSON.parse(JSON.stringify(resp)));
        resolve(JSON.parse(JSON.stringify(resp)));
      })
      .catch(err => {
        // failed to register
        // console.log(`In profile.service err (registerProfile): ${err}`);
        reject(err);
      });
  });
};

export const deleteProfile = () => {
  return new Promise((resolve, reject) => {
    dbProfile
      .deleteAllProfile()
      .then(resp => {
        // success registered
        // console.log(`success delete: ${resp}`);
        // console.log(JSON.parse(JSON.stringify(resp)));
        // update login state in redux
        store.dispatch(Actions.update_first_launch());
        resolve(JSON.parse(JSON.stringify(resp)));
      })
      .catch(err => {
        // failed to register
        // console.log(`In profile.service err (registerProfile): ${err}`);
        reject(err);
      });
  });
};
