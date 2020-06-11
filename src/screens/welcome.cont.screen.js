import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActionSheetIOS,
    Alert
} from 'react-native';
// styles
import commonStyles from '../styles/common.style';
import styles from '../styles/welcome.style';
// resources
import stringResource from '../resources/string.resource';
// services
import * as serviceProfile from '../services/profile.service';
import * as servicePayslip from '../services/payslip.service';

class WelcomeContScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deductionAmount: ''
        }
    }

    onDeductionAmountChange(value){
        this.setState({
            deductionAmount: value
        })
    }

    onRegisterProfile(){
        const user = this.props.route.params
        let data = {
            rank: user.rank.rankPay,
            mealAllowance: 0,
            deductionAmount: this.state.deductionAmount,
            claimAmount: 0,
        };
        serviceProfile.createProfile(user).then(() => {
          console.log('user profile created');
          servicePayslip.calculatePayslipTemplate(data).then(resp => {
            console.log('template calculated');
            console.log(JSON.parse(JSON.stringify(resp)));
          })
          .catch(err => {
            console.log(err);
          });
        })
        .catch(err => {
          console.log(err);
        });
    }

    render() {
        return (
            <KeyboardAvoidingView
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
              enabled
              keyboardVerticalOffset={-100}
              style={styles.keyboard}>
              {/* Main container */}
              <View style={commonStyles.container}>
                {/* Top header */}
                <View
                  style={styles.topContainer}>
                  <Text
                    style={styles.title}>
                    {stringResource.formHeaders.welcome_mainHeaders[1]}
                  </Text>
                </View>
                {/* Middle content */}
                <View
                  style={styles.middleContainer}>
                  {/* Input name */}
                  <View>
                    <Text style={styles.inputHeader}>
                      {stringResource.formHeaders.welcome_otherHeader[0]}
                    </Text>
                    <TextInput
                      style={styles.inputText}
                      placeholder={
                        `Total ${stringResource.formHeaders.welcome_otherHeader[0].toLowerCase()}`
                      }
                      onChangeText={deductionAmount => this.onDeductionAmountChange(deductionAmount)}
                    />
                  </View>
                  {/* Register profile button */}
                  {/* button - continue */}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onRegisterProfile()}>
                    <Text style={styles.btnText}>
                      {stringResource.formHeaders.welcome_buttons[1]}
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onRetrievePayslips()}>
                    <Text style={styles.btnText}>
                      {stringResource.formHeaders.welcome_buttons[0]}
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </KeyboardAvoidingView>
        )
    }
}

export default WelcomeContScreen;