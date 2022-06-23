import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
//https://www.npmjs.com/package/use-immer
import { useImmerReducer } from "use-immer";
//https://djoser.readthedocs.io/en/latest/settings.html#send-activation-email
// MUI
import {
	Grid,AppBar,Typography,Button,Card,CardHeader,CardMedia,CardContent,CircularProgress,
    TextField,Snackbar,Alert,FormControl,InputLabel,OutlinedInput,InputAdornment,IconButton
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { makeStyles } from "@mui/styles";

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
	};

	function Reducer(draft, action) {
		switch (action.type) {
			case "catchUsernameChange":
				draft.usernameValue = action.usernameChosen;
				break;
			case "catchEmailChange":
				draft.emailValue = action.emailChosen;
				break;
			case "catchPasswordChange":
				draft.passwordValue = action.passwordChosen;
				break;
			case "catchPassword2Change":
				draft.password2Value = action.password2Chosen;
				break;
			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
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
					navigate('/')
				} catch (error) {
				}
			}
			SignUp();
			return () => {
				source.cancel();
			};
		}
	}, [state.sendRequest]);

    return (
        <div className={classes.formContainer}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent="center">
					<Typography variant="h4">Create Account</Typography>
				</Grid>
                <Grid item container style={{ marginTop: "0.5rem" }}>
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
					id="email" 
					label="Email" 
					variant="outlined" 
					fullWidth
					value={state.emailValue}
					onChange={(e) =>dispatch({type: "catchEmailChange", emailChosen: e.target.value})}
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
					/>
                </Grid>
                <Grid item container xs={8}
					style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}>
					<Button 
					variant="contained" 
					fullWidth 
					type="submit" 
					className={classes.registerBtn}
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
        </div>
    )
}

export default UserRegister