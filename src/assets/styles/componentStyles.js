import tooltip from "../styles/tooltipStyle.js"

const componentStyles = {
  /* Header */
  header: {
    boxShadow:
      "0 2px 5px 0px rgba(0, 0, 0, 0.12), 0 2px 5px -5px rgba(0, 0, 0, 0.15) !important",
  },
  iconLogo: {
    width: 40
  },
  logo: {
    width: 160
  },
  footerLogo: {
    width: 80,
    marginTop: -5
  },
  ...tooltip,
  marginRight5: {
    marginRight: "5px"
  },
  addUserNumber:{
    display: "inline-block",
    width: "85%"
  },
  addUserDelButton:{
    float:"right"
  }
};

export default componentStyles;
