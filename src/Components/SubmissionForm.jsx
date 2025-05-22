import React from "react"
import {Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography} from "@mui/material"

export default function SubmissionForm({
    form, handleFormSubmit, handleFormChange, formErr, formMsg, loading, POSTS
}) {
    return(
        <>
        <Paper elevation={6} className="glass-card" sx={{ p:4, minWidth: 350, maxWidth: 400}}>
            <Typography variant="h5" mb={2} fontWeight={600}>Submit Your Data</Typography>
            <form onSubmit={handleFormSubmit} autoComplete="off">
                <TextField label="First Name" name="firstName" value={form.firstName || ""} onChange={handleFormChange} error={!!formErr.firstName} helperText={formErr.firstName} fullWidth margin="normal"/>
                <TextField label="Last Name" name="lastName" value={form.lastName || ""} onChange={handleFormChange} error={!!formErr.lastName} helperText={formErr.lastName} fullWidth margin="normal"/>
                <TextField label="Email" name="email" value={form.email || ""} onChange={handleFormChange} error={!!formErr.email} helperText={formErr.email} fullWidth margin="normal"/>
                <TextField label="Age" name="age" type="number" value={form.age || ""} onChange={handleFormChange} error={!!formErr.age} helperText={formErr.age} fullWidth margin="normal"/>
                <FormControl fullWidth margin="normal" error={!!formErr.post}>
                    <InputLabel>POST</InputLabel>
                    <Select
                        name="post"
                        value={form.post || ""}
                        label="POST"
                        onChange={handleFormChange}
                    >
                        {POSTS.map((p)=>(
                            <MenuItem key={p} value={p}>{p}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography variant="caption" color="error">{formErr.post}</Typography>
                <TextField label="Description" name="description" value={form.description || ""} onChange={handleFormChange} error={!!formErr.description} helperText={formErr.description} fullWidth margin="normal"/>
                <Button variant="outlined" component="label" fullWidth sx={{ mt:1 , mb:1}}>UPLOAD FILE(PDF or WORD)
                    <input type="file" name="file" accept=".pdf, .docx" hidden onChange={handleFormChange}/>
                </Button>
                {formErr.file && <Typography variant="caption" color="error">{formErr.file}</Typography>}
                <Button type="submit" variant="outlined" color="primary" fullWidth sx={{ mt:2 }} disabled={loading}>
                    {loading ? "Submitting... Wait": "Submit"}
                </Button>
                {formMsg && <Typography variant="caption" color="success.main">{formMsg}</Typography>}
            </form>
        </Paper>
        </>
    )
}