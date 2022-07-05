import React, { useEffect, useState , useContext} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
// MUI
import {
	Grid,AppBar,Typography,Button,Card,CardHeader,CardMedia,CardContent,CircularProgress,
    TextField,Snackbar,Alert,styled
} from "@mui/material";
//import { makeStyles } from "@mui/styles";

//Contexts
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

const useStyles = styled({
    formContainer: {
		width: "50%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "10rem",
		border: "5px solid",
		padding: "2rem",
        color: "#E9B7C6",
        boxShadow: '3px 3px 3px #E9B7C6'
	},
    loginBtn: {
		backgroundColor: "#E9B7C6",
		color: "white",
		fontSize: "1.1rem",
		marginLeft: "1rem",
		"&:hover": {
			backgroundColor: "#139879",
		},
	},

});


function Login() {

  const classes = useStyles();
  const navigate = useNavigate();

  //Contexts
  const globalDispatch = useContext(DispatchContext);
  const globalState = useContext(StateContext);

  const initialState = {
		usernameValue: "",
		emailValue: "",
		sendRequest: 0,
		token:'',
		showPassword:false,
		openSnack: false,
		disabledBtn: false,
		serverError: false,
		};

	function Reducer(draft, action) {
		switch (action.type) {
			case "catchUsernameChange":
				draft.usernameValue = action.usernameChosen;
				draft.serverError = false;
				break;
			case "catchPasswordChange":
				draft.passwordValue = action.passwordChosen;
				//we need to update this!!! don't forget!!!
				draft.serverError = false;
				break;
			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
				break;
			case "catchToken":
				draft.token = action.tokenValue;
				break;
			case "openTheSnack":
				draft.openSnack = true;
				break;
			case "disableTheButton":
				draft.disabledBtn = true;
				break;
			case "allowTheButton":
				draft.disabledBtn = false;
				break;
			case "catchServerError":
				draft.serverError = true;
				break;
		}
	}
	const [state, dispatch] = useImmerReducer(Reducer, initialState);

  function FormSubmit(e) {
		e.preventDefault();
		dispatch({ type: "changeSendRequest" });
		dispatch({ type: "disableTheButton" });
	}

  useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate("/");
			}, 1200);
		}
	}, [state.openSnack]);

  useEffect(() => {
		if (state.sendRequest) {
			const source = Axios.CancelToken.source();
			async function SignIn() {
				try {
					const response = await Axios.post(
						"https://www.lbhop.com/api-auth/token/login/",
						{
							username: state.usernameValue,
							password: state.passwordValue,
						},
						{
							cancelToken: source.token,
						}
					);
					dispatch({
									type: "catchToken",
									tokenValue: response.data.auth_token,
								});
					globalDispatch({
									type: "catchToken",
									tokenValue: response.data.auth_token,
								});
          //console.log(response);

					//navigate('/')
				} catch (error) {
					dispatch({ type: "allowTheButton" });
					dispatch({ type: "catchServerError" });
          //console.log(error.response)
				}
			}
			SignIn();
			return () => {
				source.cancel();
			};
		}
	}, [state.sendRequest]);

  //GET user data
  useEffect(() => {
		if (state.token !== "") {
			const source = Axios.CancelToken.source();
			async function getUserData() {
				try {
					const response = await Axios.get(
						"https://www.lbhop.com/api-auth/users/me/",
						{
              headers: { Authorization: "Token ".concat(state.token) },
						},
						{
							cancelToken: source.token,
						}
					);
          //console.log(response);
				globalDispatch({
								type: "userSignIn",
								usernameInfo: response.data.username,
								emailInfo: response.data.email,
								idInfo: response.data.id,
							});
					dispatch({ type: "openTheSnack" });
				} catch (error) {
          console.log(error.response)
				}
			}
			getUserData();
			return () => {
				source.cancel();
			};
		}
	}, [state.token]);
  return (
      <div 
	  style={{width: "50%",
	  marginLeft: "auto",
	  marginRight: "auto",
	  marginTop: "10rem",
	  border: "5px solid",
	  padding: "2rem",
	  color: "#E9B7C6",
	  boxShadow: '3px 3px 3px #E9B7C6'}}
	  className={classes.formContainer}>
          <form onSubmit={FormSubmit}>
              <Grid item container justifyContent="center">
                <Typography variant="h4">Sign In Your Account</Typography>
              </Grid>
			  {state.serverError ? (
					<Alert severity="error">Incorrect username or password!</Alert>
				) : (
					""
				)}
              <Grid item container style={{ marginTop: "2rem" }}>
                  <TextField 	
                  id="username" 
                  label="Username" 
                  variant="outlined" 
                  fullWidth
                  value={state.usernameValue}
				  onChange={(e) =>dispatch({type: "catchUsernameChange", usernameChosen: e.target.value})}
				  error={state.serverError ? true : false}
				   />
              </Grid>
              <Grid item container style={{ marginTop: "0.5rem" }}>
                  <TextField 	
                  id="password" 
                  obscureText="true"
                  type={state.showPassword ? "text" : "password"}
                  label="password" 
                  variant="outlined" 
                  fullWidth
                  value={state.passwordValue}
				  onChange={(e) =>dispatch({type: "catchPasswordChange", passwordChosen: e.target.value})}
				  error={state.serverError ? true : false}
					/>
					
              </Grid>
              <Grid item container xs={8} style={{ marginTop: "2rem", marginLeft: "auto", marginRight: "auto" }}>
                <Button variant="contained" fullWidth type="submit" 
				style={{
					backgroundColor: "#E9B7C6",
					color: "white",
					fontSize: "1.1rem",
					marginLeft: "1rem",
					"&:hover": {
						backgroundColor: "#139879",
					},
				}}
				className={classes.loginBtn} disabled={state.disabledBtn}>
                  SIGN IN
                </Button>
              </Grid>
          </form>
          <Grid item container justifyContent="center" style={{ marginTop: "1rem", color:'black', fontSize: "0.8rem",}}>
            <Typography variant="small">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/UserRegister")}
                style={{ cursor: "pointer", color: "#139879" }}
              >
                Register Here
              </span>
            </Typography>
          </Grid>
		  <Snackbar
				open={state.openSnack}
				message="You have successfully logged in!"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
		/>
      </div>
  )
}

export default Login