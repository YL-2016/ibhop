import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
//https://www.npmjs.com/package/use-immer
import { useImmerReducer } from "use-immer";
//https://djoser.readthedocs.io/en/latest/settings.html#send-activation-email
// MUI
import {
	Grid,Typography,Button,TextField,Snackbar,Alert,styled
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
//import { makeStyles } from "@mui/styles";

const useStyles = styled({
    formContainer: {
		width: "50%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "5rem",
		border: "5px solid",
		padding: "2rem",
        color: "#E9B7C6",
        boxShadow: '3px 3px 3px #E9B7C6'
	},
    registerBtn: {
		backgroundColor: "#E9B7C6",
		color: "white",
		fontSize: "1.1rem",
		marginLeft: "1rem",
		"&:hover": {
			backgroundColor: "#139879",
		},
	},

});

function UserRegister() {
    const classes = useStyles();
	const navigate = useNavigate();

	const initialState = {
		usernameValue: "",
		emailValue: "",
		passwordValue: "",
		password2Value: "",
		sendRequest: 0,
		showPassword:false,
		openSnack: false,
		disabledBtn: false,
		usernameErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		emailErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		passwordErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		password2HelperText: "",
		serverMessageUsername: "",
		serverMessageEmail: "",
		serverMessageSimilarPassword: "",
		serverMessageCommonPassword: "",
		serverMessageNumericPassword: "",
	};

	function Reducer(draft, action) {
		switch (action.type) {
			case "catchUsernameChange":
				draft.usernameValue = action.usernameChosen;
				draft.usernameErrors.hasErrors = false;
				draft.usernameErrors.errorMessage = "";
				draft.serverMessageUsername = "";
				break;
			case "catchEmailChange":
				draft.emailValue = action.emailChosen;
				draft.emailErrors.hasErrors = false;
				draft.emailErrors.errorMessage = "";
				draft.serverMessageEmail = "";
				break;
			case "catchPasswordChange":
				draft.passwordValue = action.passwordChosen;
				draft.passwordErrors.hasErrors = false;
				draft.passwordErrors.errorMessage = "";
				draft.serverMessageSimilarPassword = "";
				draft.serverMessageCommonPassword = "";
				draft.serverMessageNumericPassword = "";
				break;
			case "catchPassword2Change":
				draft.password2Value = action.password2Chosen;
				if (action.password2Chosen !== draft.passwordValue) {
					draft.password2HelperText = "The passwords must match";
				} else if (action.password2Chosen === draft.passwordValue) {
					draft.password2HelperText = "";
				}
				break;
			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
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
			case "catchUsernameErrors":
				if (action.usernameChosen.length === 0) {
					draft.usernameErrors.hasErrors = true;
					draft.usernameErrors.errorMessage = "This field must not be empty";
				} else if (action.usernameChosen.length < 5) {
					draft.usernameErrors.hasErrors = true;
					draft.usernameErrors.errorMessage =
						"The username must have at least five characters";
				} else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) {
					draft.usernameErrors.hasErrors = true;
					draft.usernameErrors.errorMessage =
						"This field must not have special characters";
				}
				break;

			case "catchEmailErrors":
				if (
					!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
						action.emailChosen
					)
				) {
					draft.emailErrors.hasErrors = true;
					draft.emailErrors.errorMessage = "Please enter a valid email!";
				}
				break;

			case "catchPasswordErrors":
				if (action.passwordChosen.length < 8) {
					draft.passwordErrors.hasErrors = true;
					draft.passwordErrors.errorMessage =
						"The password must at least have 8 characters!";
				}
				break;

			case "usernameExists":
				draft.serverMessageUsername = "This username already exists!";
				break;

			case "emailExists":
				draft.serverMessageEmail = "This email already exists!";
				break;

			case "similarPassword":
				draft.serverMessageSimilarPassword =
					"The password is too similar to the username!";
				break;

			case "commonPassword":
				draft.serverMessageCommonPassword = "The password is too common and the password must not only contain numbers!";
				break;

			case "numericPassword":
				draft.serverMessageNumericPassword =
					"The password must not only contain numbers!";
				break;
		}
	}
	const [state, dispatch] = useImmerReducer(Reducer, initialState);

	function FormSubmit(e) {
		e.preventDefault();
		if (
			!state.usernameErrors.hasErrors &&
			!state.emailErrors.hasErrors &&
			!state.passwordErrors.hasErrors &&
			state.password2HelperText === ""
		) {
			dispatch({ type: "changeSendRequest" });
			dispatch({ type: "disableTheButton" });
		}
	}
	useEffect(() => {
		if (state.sendRequest) {
			const source = Axios.CancelToken.source();
			async function SignUp() {
				try {
					const response = await Axios.post(
						"http://localhost:8000/api-auth/users/",
						{
							username: state.usernameValue,
							email: state.emailValue,
							password: state.passwordValue,
							re_password: state.password2Value,
						},
						{
							cancelToken: source.token,
						}
					);
					dispatch({ type: "openTheSnack" });
				} catch (error) {
					dispatch({ type: "allowTheButton" });
					if (error.response.data.username) {
						dispatch({ type: "usernameExists" });
					} else if (error.response.data.email) {
						dispatch({ type: "emailExists" });
					} else if (
						error.response.data.password[0] ===
						"The password is too similar to the username."
					) {
						dispatch({ type: "similarPassword" });
					} else if (
						error.response.data.password[0] === "This password is too common."
					) {
						dispatch({ type: "commonPassword" });
					} else if (
						error.response.data.password[1] ===
						"This password is entirely numeric."
					) {
						dispatch({ type: "numericPassword" });
					}
				}
			}
			SignUp();
			return () => {
				source.cancel();
			};
		}
	}, [state.sendRequest]);

	useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate("/login");
			}, 1200);
		}
	}, [state.openSnack]);

    return (
        <div 
		style={{width: "50%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "5rem",
		border: "5px solid",
		padding: "2rem",
        color: "#E9B7C6",
        boxShadow: '3px 3px 3px #E9B7C6'}}
		className={classes.formContainer}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent="center">
					<Typography variant="h4">Create Account</Typography>
				</Grid>
				{state.serverMessageUsername ? (
					<Alert severity="error">{state.serverMessageUsername}</Alert>
				) : (
					""
				)}
				{state.serverMessageEmail ? (
					<Alert severity="error">{state.serverMessageEmail}</Alert>
				) : (
					""
				)}

				{state.serverMessageSimilarPassword ? (
					<Alert severity="error">{state.serverMessageSimilarPassword}</Alert>
				) : (
					""
				)}

				{state.serverMessageCommonPassword ? (
					<Alert severity="error">{state.serverMessageCommonPassword}</Alert>
				) : (
					""
				)}

				{state.serverMessageNumericPassword ? (
					<Alert severity="error">{state.serverMessageNumericPassword}</Alert>
				) : (
					""
				)}
                <Grid item container style={{ marginTop: "0.5rem" }}>
                    <TextField 	
					id="username" 
					label="Username" 
					variant="outlined" 
					fullWidth
					value={state.usernameValue}
					onChange={(e) =>dispatch({type: "catchUsernameChange", usernameChosen: e.target.value})}
					onBlur={(e) =>
						dispatch({
							type: "catchUsernameErrors",
							usernameChosen: e.target.value,
						})
					}
					error={state.usernameErrors.hasErrors ? true : false}
					helperText={state.usernameErrors.errorMessage}
					/>
                </Grid>
                <Grid item container style={{ marginTop: "0.5rem" }}>
                    <TextField 	
					id="email" 
					label="Email" 
					variant="outlined" 
					fullWidth
					value={state.emailValue}
					onChange={(e) =>dispatch({type: "catchEmailChange", emailChosen: e.target.value})}
					onBlur={(e) =>
						dispatch({
							type: "catchEmailErrors",
							emailChosen: e.target.value,
						})
					}
					error={state.emailErrors.hasErrors ? true : false}
					helperText={state.emailErrors.errorMessage}
					/>
                </Grid>

                <Grid item container style={{ marginTop: "0.5rem" }}>
                    <TextField 	
					id="password" 
					label="Password" 
					obscureText="true"
					variant="outlined" 
					fullWidth
					type={state.showPassword ? "text" : "password"}
					value={state.passwordValue}
					onChange={(e) =>dispatch({type: "catchPasswordChange", passwordChosen: e.target.value})}
					onBlur={(e) =>
						dispatch({
							type: "catchPasswordErrors",
							passwordChosen: e.target.value,
						})
					}
					error={state.passwordErrors.hasErrors ? true : false}
					helperText={state.passwordErrors.errorMessage}
					/>
                </Grid>

                <Grid item container style={{ marginTop: "0.5rem" }}>
                    <TextField 	
					id="confirmPassword" 
					label="Confirm Password" 
					obscureText="true"
					type={state.showPassword ? "text" : "password"}
					variant="outlined" 
					fullWidth
					value={state.password2Value}
					onChange={(e) =>dispatch({type: "catchPassword2Change", password2Chosen: e.target.value})}
					helperText={state.password2HelperText}
					/>
                </Grid>
                <Grid item container xs={8}
					style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}>
					<Button 
					variant="contained" 
					fullWidth 
					type="submit" 
					style={{backgroundColor: "#E9B7C6",
					color: "white",
					fontSize: "1.1rem",
					marginLeft: "1rem",
					"&:hover": {
						backgroundColor: "#139879",
					},}}
					className={classes.registerBtn}
					disabled={state.disabledBtn}
					>
						SIGN UP
					</Button>
				</Grid>
            </form>
            <Grid item container justifyContent="center" style={{ marginTop: "1rem", color:'black', fontSize: "0.8rem",}}>
				<Typography variant="small">
					Already have an account?{" "}
					<span
						onClick={() => navigate("/login")}
						style={{ cursor: "pointer", color: "#139879" }}
					>
						SIGN IN
					</span>
				</Typography>
			</Grid>
			<Snackbar
				open={state.openSnack}
				message="You have successfully registered!"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
		/>
        </div>
    )
}

export default UserRegister