// API routing details for the various login and profile functions in the interviewBotLoginAndFetchProfile lambda

const apiConfig = {
    baseUrl: process.env.REACT_APP_LOGIN_API_ENDPOINT,
    interviewBotProfileRoutes: {
      loginAndFetchProfile: "/interviewbotprofileactions/loginandfetchprofile",
      updateProfile: "/interviewbotprofileactions/updateprofile",
      accountProfile: "/interviewbotprofileactions/accountprofile",
      interviewHistory: "/interviewbotprofileactions/interviewhistory",
    },
  };
  
  export default apiConfig;
  