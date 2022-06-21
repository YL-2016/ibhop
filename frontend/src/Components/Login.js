import React, { useEffect, useState , useContext} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
// MUI
import {
	Grid,AppBar,Typography,Button,Card,CardHeader,CardMedia,CardContent,CircularProgress,
    TextField,Snackbar,Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

//Contexts
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

const useStyles = makeStyles({
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
	};

	function Reducer(draft, action) {
		switch (action.type) {
			case "catchUsernameChange":
				draft.usernameValue = action.usernameChosen;
				break;
			case "catchPasswordChange":
				draft.passwordValue = action.passwordChosen;
				break;
			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
				break;
      case "catchToken":
        draft.token = action.tokenValue;
        break;
		}
	}
	const [state, dispatch] = useImmerReducer(Reducer, initialState);

  function FormSubmit(e) {
		e.preventDefault();
		dispatch({ type: "changeSendRequest" });
	}

  useEffect(() => {
		if (state.sendRequest) {
			const source = Axios.CancelToken.source();
			async function SignIn() {
				try {
					const response = await Axios.post(
						"http://localhost:8000/api-auth/token/login/",
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
          console.log(error.response)
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
						"http://localhost:8000/api-auth/users/me/",
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
					navigate('/')
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
      <div className={classes.formContainer}>
          <form onSubmit={FormSubmit}>
              <Grid item container justifyContent="center">
                <Typography variant="h4">Sign In Your Account</Typography>
              </Grid>
              <Grid item container style={{ marginTop: "2rem" }}>
                  <TextField 	
                  id="username" 
                  label="Username" 
                  variant="outlined" 
                  fullWidth
                  value={state.usernameValue}
					        onChange={(e) =>dispatch({type: "catchUsernameChange", usernameChosen: e.target.value})}
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
					        />
              </Grid>
              <Grid item container xs={8} style={{ marginTop: "2rem", marginLeft: "auto", marginRight: "auto" }}>
                <Button variant="contained" fullWidth type="submit" className={classes.loginBtn}>
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
      </div>
  )
}

export default Login