var Roblox = Roblox || {};
Roblox.LangDynamic = Roblox.LangDynamic || {};
Roblox.LangDynamic["Feature.AccountSecurityPrompt"] = {"Action.AbortDismissForeverAddEmail":"Add Email","Action.AbortDismissForeverChangePassword":"Change Password","Action.ChangeEmail":"Change Email","Action.ConfirmDismissForeverAddEmail":"Yes, I'm Sure","Action.ConfirmDismissForeverChangePassword":"Yes, I'm Sure","Action.ContinueAddEmail":"Continue","Action.ContinueChangePassword":"Continue","Action.DismissForever":"Don't Show This For 30 Days","Action.RemindMeLater":"Remind Me Later","Action.ResendPasswordResetEmail":"Resend Password Reset Email","Action.SecureAccount":"Secure My Account","Action.SubmitChangePassword":"Change Password","Action.UnlockAccountPin":"Unlock Account","Message.Error.Email.FeatureDisabled":"This feature is currently disabled. Please try again later.","Message.Error.Email.TooManyAccountsOnEmail":"There are too many accounts associated with this email address.","Message.Error.Email.TooManyAttemptsToUpdateEmail":"Too many attempts to update email. Please try again later.","Message.Error.Email.InvalidEmailAddress":"Invalid email address.","Message.Error.Email.Default":"An unknown error occured.","Message.Error.Input.InvalidEmail":"Invalid email address.","Message.Error.Input.PasswordsDoNotMatch":"New password does not match confirmation.","Message.Error.Password.Flooded":"Too many attempts. Please try again later.","Message.Error.Password.InvalidPassword":"New password did not meet security requirements.","Message.Error.Password.InvalidCurrentPassword":"Current password is incorrect.","Message.Error.Password.PinLocked":"Your account is locked with a PIN.","Message.Error.Password.Default":"An unknown error occured.","Message.Error.PasswordReset.UserDoesNotHaveEmail":"No email address is associated with your account.","Message.Error.PasswordReset.Default":"An unknown error occured.","Message.Error.Pin.NoAccountPin":"No PIN exists on your account.","Message.Error.Pin.AccountLocked":"Your account is locked.","Message.Error.Pin.Flooded":"Too many attempts. Please try again later.","Message.Error.Pin.IncorrectPin":"Incorrect PIN.","Message.Error.Pin.Default":"An unknown error occured.","Description.AddYourEmailUnder13":"To keep your account safe, please add your parent's email and reset your password.","Description.AddYourEmail":"To keep your account safe, please add your email and reset your password.","Description.AreYouSureDismissForeverAddEmailUnder13":"Someone might be using your account without your permission. To keep your account safe, please add your parent's email and reset your password.","Description.AreYouSureDismissForeverAddEmail":"Someone might be using your account without your permission. To keep your account safe, please add your email and reset your password.","Description.AreYouSureDismissForeverChangePassword":"Someone might be using your account without your permission. To keep your account safe, please change your password.","Description.ChangeYourPassword":"To keep your account safe, please change your password.","Description.ChangeYourPasswordSuccess":"You have successfully changed your password.","Description.CheckYourEmailUnder13":"Please ask your parent to check the email we sent to {emailAddress} and follow the instructions to reset your password. They may need to refresh their inbox or check their spam folder.","Description.CheckYourEmail":"Please check the email we sent to {emailAddress} and follow the instructions to reset your password. You may need to refresh your inbox or check your spam folder.","Description.EnterYourAccountPin":"Please enter the PIN for this account to change your password.","Description.UnusualActivity":"We have detected some unusual activity on your account.","Header.AccountPinExpired":"Account PIN Expired","Header.AccountPinRequired":"Enter Your Account PIN","Header.AddYourEmailUnder13":"Add Your Parent's Email","Header.AddYourEmail":"Add Your Email","Header.AreYouSure":"Are You Sure","Header.ChangeYourPassword":"Change Your Password","Header.CheckYourEmailUnder13":"Check Your Parent's Email","Header.CheckYourEmail":"Check Your Email","Header.Success":"Success","Label.AccountPin":"Account PIN","Label.ConfirmNewPassword":"Confirm New Password","Label.CurrentPassword":"Current Password","Label.MinutesSeconds":"{minutes} min {seconds} sec","Label.NewPassword":"New Password","Label.TimeRemaining":"Time Remaining","Label.YourEmailUnder13":"Your Parent's Email","Label.YourEmail":"Your Email","Action.DismissTemporary":"Dismiss For Now","Description.ChangeYourPasswordClickHere":"To keep your account safe, please click here to change your password.","Message.Error.PasswordValidation.Default":"An unknown error occurred.","Message.Error.PasswordValidation.WeakPassword":"Password must be at least 8 characters long and include at least 2 digits, 4 letters, and 1 symbol.","Message.Error.PasswordValidation.ShortPassword":"Password must be at least 8 characters long.","Message.Error.PasswordValidation.PasswordSameAsUsername":"Password must not be your username.","Message.Error.PasswordValidation.ForbiddenPassword":"This password is not allowed. Please choose a different password.","Message.Error.PasswordValidation.DumbStrings":"Please create a more complex password.","Message.Error.PromptAssignments.Default":"An error occurred. Please try again later.","Header.YourPasswordMightBeStolen":"Your Password Might Be Stolen!","Description.ChangeYourPasswordImmediately":"To keep your account safe, please change your password immediately.","Description.ChangeYourPasswordImmediatelyClickHere":"To keep your account safe, please click here to change your password immediately.","Description.NoChangeForceReset":"If you don't change it, your password will be automatically reset in {boldStart}{days} days{boldEnd}.","Label.IForgotMyPassword":"I forgot my password","Label.UseAUniquePassword":"Use a password that isn't in use in other apps","Label.AtLeastCharacters":"At least {count} characters","Header.CreateAStrongPassword":"Create A Strong Password","Action.MaybeLater":"Maybe Later","Header.SuspiciousActivityDetected":"Suspicious Activity Detected!","Header.SomeoneMightBeUsingYourAccount":"Someone Might Be Using Your Account!","Header.UnusualActivityDetected":"Unusual Activity Detected!","Header.AuthenticatorUpsellWelcomeMessage":"Keep Your Account Super Safe!","Label.AuthenticatorUpsellTwoFactorHeadline":"2 Factors Are Better Than 1","Label.AuthenticatorUpsellTwoFactorMessage":"Enter password and unique codes from another device for logins, big purchases and more.","Label.AuthenticatorUpsellProtectRobuxHeadline":"Protect Your Experiences, Robux and More","Label.AuthenticatorUpsellProtectRobuxMessage":"Extra security so that you never lose access to your experiences, robux, limiteds and more.","Label.AuthenticatorUpsellBadActorHeadline":"Keep Bad Actors Out","Label.AuthenticatorUpsellBadActorMessage":"Even if your password or email is stolen, it won’t be enough to log into your account.","Label.AuthenticatorUpsellSetupAuthenticatorButtonMessage":"Set Up Authenticator","Header.AuthenticatorUpsellDownloadAuthenticator":"Download Authenticator App","Label.AuthenticatorUpsellDownloadInstruction":"Download an Authenticator app on your device. We suggest the following apps.","Label.AuthenticatorUpsellMicrosoftOption":"Microsoft Authenticator","Label.AuthenticatorUpsellGoogleOption":"Google Authenticator","Label.AuthenticatorUpsellTwilioOption":"Twilio's Authy","Description.NoChangeForceResetSingular":"If you don't change it, your password will be automatically reset in {boldStart}1 day{boldEnd}.","Action.AuthenticatorUpsellNextButtonMessage":"Next","Header.AccountRestoresPolicyUpdate":"Account Restores Policy Update","Description.AccountRestoresPolicy":"Starting 10th Jan 2022, you must enable 2-Step Verification via Authenticator to be eligible for account restores if your account is hacked.","Description.AuthenticatorSetupPromptClickHere":"Your security is important to us: {styleTagStart}Click here{styleTagEnd} to set up Authenticator.","Description.AuthenticatorSetupPrompt":"Your security is important to us: Open Settings to set up Authenticator and learn more on our {linkStart}help page{linkEnd}.","Action.OpenSettings":"Open Settings","Description.AccountRestoresPolicyWithDate":"Starting {date}, you must enable 2-Step Verification via Authenticator to be eligible for account restores if your account is hacked.","Description.ChangeYourPasswordClickHereStyled":"To keep your account safe, please {styleTagStart}click here{styleTagEnd} to change your password.","Description.ChangeYourPasswordImmediatelyClickHereStyled":"To keep your account safe, please {styleTagStart}click here{styleTagEnd} to change your password immediately.","Header.KeepYourAccountSafeLong":"Keep Your Account Safe With 2-Step Verification Via Authenticator","Header.KeepYourAccountSafeShort":"Keep Your Account Safe With Authenticator","Description.AuthenticatorSetupPromptNew":"We recommend that you enable 2-Step Verification via an authenticator app to make your account more secure. This would help keep your account safe even if your password or email is stolen. If your account is compromised, Customer Support will evaluate the security measures you put in place as we try to help you recover any lost value. Learn more on our {linkStart}help page{linkEnd}.","Description.AuthenticatorSetupPromptNewShort":"We recommend that you enable 2-Step Verification via an authenticator app to keep your account safe. If your account is compromised, Customer Support will evaluate the security measures you put in place as we try to help you recover any lost value. Learn more on our {linkStart}help page{linkEnd}.","Header.AccountRestorePolicyMessageSubject":"Enable 2-step verification via authenticator to keep your account safe","Description.AccountRestorePolicyMessageBody":"Hi, {lineBreak}{lineBreak}We recommend that you enable 2-step verification via an authenticator app to make your account more secure. This will help keep your account safe even if your password or email is stolen. In the event that your account is ever compromised, Customer Support will evaluate the security measures you put in place as we try to help you recover any lost value. {lineBreak}{lineBreak}You can set up an authenticator app on your account by going to {securityPageLinkStart}https://www.rbx2016.tk/my/account#!/security{linkEnd}. {lineBreak}{lineBreak}For more information, please visit our {helpPageLinkStart}help page{linkEnd}.","Header.TwoStepVerificationUpdate":"2-Step Verification Update","Description.AuthenticatorForcedOverEmail":"You have recently had 2-Step Verification via both Email and Authenticator App turned on. In most cases, to keep your account secure, you will only be allowed to verify via Authenticator.","Description.AuthenticatorForcedOverEmailPresent":"You currently have 2-Step Verification via both Email and Authenticator App turned on. In most cases, to keep your account secure, you will only be allowed to verify via Authenticator.","Description.LearnMoreHere":"Learn more {linkStart}here{linkEnd}."};
window.Roblox && window.Roblox.BundleDetector && window.Roblox.BundleDetector.bundleDetected("DynamicLocalizationResourceScript_Feature.AccountSecurityPrompt");
