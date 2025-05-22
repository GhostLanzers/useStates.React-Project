import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';

export default function AdminDashboard({
    dashParams,
    handleDashParam,
    subs,
    editId,
    editForm,
    editErr,
    handleEditChange,
    handleEditSubmit,
    startEdit,
    setEditId,
    handleDelete,
    total,
    loading,
    handlePageChange,
    POSTS
}) {
    return (
        <>
            <Paper elevation={6} className="glass-card" sx={{ p: 3, minWidth: 900, maxWidth: "95vw" }}>
                <Typography variant="h5" mb={2} fontWeight={600}>Admin Dashboard</Typography>
                {/* Filters */}
                <Box mb={2} display="flex" gap={2} flexWrap="wrap">
                    <TextField label="Search (POST/NAME)" name="search" value={dashParams.search} onChange={handleDashParam} size="small" />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>POST</InputLabel>
                        <Select name="post" value={dashParams.post} label="Post" onChange={handleDashParam}>
                            <MenuItem value="">ALL</MenuItem>
                            {POSTS.map((p) => (
                                <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField label="Age <" name="age[lt]" value={dashParams["age[lt]"]} onChange={handleDashParam} size="small" type="number" />
                    <TextField label="Age >" name="age[gt]" value={dashParams["age[gt]"]} onChange={handleDashParam} size="small" type="number" />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>SORT BY</InputLabel>
                        <Select name="sort" value={dashParams.sort} label="Sort by" onChange={handleDashParam}>
                            <MenuItem value="creation_date">CREATION DATE</MenuItem>
                            <MenuItem value="post">POST</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {/* Table */}
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Post</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>File</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subs.map((row) =>
                                editId === row.id ? (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <TextField
                                                name="firstName"
                                                value={editForm.firstName}
                                                onChange={handleEditChange}
                                                error={!!editErr.firstName}
                                                helperText={editErr.firstName}
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                            <TextField
                                                name="lastName"
                                                value={editForm.lastName}
                                                onChange={handleEditChange}
                                                error={!!editErr.lastName}
                                                helperText={editErr.lastName}
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleEditChange}
                                                error={!!editErr.email}
                                                helperText={editErr.email}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="age"
                                                value={editForm.age}
                                                onChange={handleEditChange}
                                                error={!!editErr.age}
                                                helperText={editErr.age}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                name="post"
                                                value={editForm.post}
                                                onChange={handleEditChange}
                                                size="small"
                                            >
                                                {POSTS.map((p) => (
                                                    <MenuItem key={p} value={p}>{p}</MenuItem>
                                                ))}
                                            </Select>
                                            <Typography variant="caption" color="red">{editErr.post}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="description"
                                                value={editForm.description}
                                                onChange={handleEditChange}
                                                error={!!editErr.description}
                                                helperText={editErr.description}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outlined" component="label" size="small">
                                                UPLOAD
                                                <input
                                                    type="file"
                                                    name="file"
                                                    accept=".pdf, .docx"
                                                    hidden
                                                    onChange={handleEditChange}
                                                />
                                            </Button>
                                            {editErr.file && <Typography variant="caption" color="red">{editErr.file}</Typography>}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">{new Date(row.creationDate).toLocaleDateString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                size="small"
                                                onClick={handleEditSubmit}
                                                disabled={loading}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                onClick={() => setEditId(null)}
                                                disabled={loading}
                                            >
                                                Cancel
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow key={row.id} className="row-anim">
                                        <TableCell>
                                            {row.name.firstName} {row.name.lastName}
                                        </TableCell>
                                        <TableCell>
                                            {row.email}
                                        </TableCell>
                                        <TableCell>
                                            {row.age}
                                        </TableCell>
                                        <TableCell>
                                            {row.post}
                                        </TableCell>
                                        <TableCell>
                                            {row.description}
                                        </TableCell>
                                        <TableCell>
                                            <a href={row.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">{new Date(row.creationDate).toLocaleDateString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="EDIT">
                                                <IconButton aria-label="edit" onClick={() => startEdit(row)} color="primary">
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton aria-label="delete" onClick={() => handleDelete(row.id)} color="error">
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Pagination */}
                <Box display="flex" justifyContent="flex-end">
                    <Pagination
                        count={Math.ceil(total / (dashParams.limit || 10))}
                        page={Math.floor((dashParams.skip || 0) / (dashParams.limit || 10)) + 1}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Paper>
        </>
    );
}