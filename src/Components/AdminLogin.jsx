import { Box, Button, Paper, TextField, Typography } from "@mui/material";

export default function AdminLogin({
    handleLogin, handleLoginChange, login, loginErr, loading
}){
    return(
        <>
            <Paper elevation={6} className="glass-card" sx={{ p:4, minWidth: 350, maxWidth: 400}}>
                <Typography variant="h5" mb={2} fontWeight={600}>Admin Login</Typography>
                <form onSubmit={handleLogin} autoComplete="off">
                    <TextField label="Email" name="email" value={login.email} onChange={handleLoginChange} fullWidth margin="normal"/>
                    <TextField label="Password" name="password" type="password" value={login.password} onChange={handleLoginChange} fullWidth margin="normal"/>
                    {loginErr && <Typography variant="caption" color="error">{loginErr}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? "Logging in... Wait" : "Login"}
                    </Button>
                </form>
            </Paper>
        </>
    )
}