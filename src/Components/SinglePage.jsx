import { Box, Button, Fade, IconButton, Slide, Tooltip, Typography } from "@mui/material";
import SubmissionForm from "./SubmissionForm";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import "../global.css";
import Logout from '@mui/icons-material/Logout';
import { useState, useEffect } from "react";

const POSTS = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Devops Developer",
    "OTHERS"
];
const ADMIN = { email: "admin@example.com", password: "admin123" };
const DUMMY_JWT = "dummy.jwt.token";

// In-memory dummy submissions for simulation
let DUMMY_SUBMISSIONS = generateDummySubmissions(25);

function generateDummySubmissions(count = 25) {
    const arr = [];
    for (let i = 1; i <= count; i++) {
        arr.push({
            id: i + "",
            name: { firstName: `User${i}`, lastName: `Test${i}` },
            email: `user${i}@mail.com`,
            age: 20 + (i % 15),
            post: POSTS[i % POSTS.length],
            description: `This is dummy description for user ${i}`,
            fileUrl: "#",
            creationDate: new Date(Date.now() - i * 86400000).toISOString(),
        });
    }
    return arr;
}

const dummyAPI = {
    login: async ({ email, password }) => {
        await new Promise((r) => setTimeout(r, 500));
        if (email === ADMIN.email && password === ADMIN.password) {
            return {
                token: DUMMY_JWT, user: { id: "1", email }
            };
        }
        throw new Error("Invalid Creds");
    },
    createSubmission: async (data) => {
        await new Promise((r) => setTimeout(r, 500));
        const newSub = {
            ...data,
            id: Date.now().toString(),
            creationDate: new Date().toISOString(),
        };
        DUMMY_SUBMISSIONS = [newSub, ...DUMMY_SUBMISSIONS];
        return newSub;
    },
    getSubmissions: async (params = {}) => {
        await new Promise((r) => setTimeout(r, 500));
        let data = [...DUMMY_SUBMISSIONS];

        // Search by name or post
        if (params.search) {
            const s = params.search.toLowerCase();
            data = data.filter(
                (d) =>
                    d.name.firstName.toLowerCase().includes(s) ||
                    d.name.lastName.toLowerCase().includes(s) ||
                    d.post.toLowerCase().includes(s)
            );
        }
        // Filter by post
        if (params.post) {
            data = data.filter((d) => d.post === params.post);
        }
        // Age filters
        if (params["age[lt]"]) {
            data = data.filter((d) => d.age < Number(params["age[lt]"]));
        }
        if (params["age[gt]"]) {
            data = data.filter((d) => d.age > Number(params["age[gt]"]));
        }
        // Sorting
        if (params.sort === "creation_date") {
            data = data.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
        } else if (params.sort === "post") {
            data = data.sort((a, b) => a.post.localeCompare(b.post));
        }
        const total = data.length;
        // Pagination
        const skip = params.skip || 0;
        const limit = params.limit || 10;
        data = data.slice(skip, skip + limit);

        return { data, total };
    },
    updateSubmission: async (id, update) => {
        await new Promise((r) => setTimeout(r, 500));
        DUMMY_SUBMISSIONS = DUMMY_SUBMISSIONS.map((d) =>
            d.id === id
                ? {
                      ...d,
                      ...update,
                      name: {
                          firstName: update.firstName,
                          lastName: update.lastName,
                      },
                  }
                : d
        );
        return DUMMY_SUBMISSIONS.find((d) => d.id === id);
    },
    deleteSubmission: async (id) => {
        await new Promise((r) => setTimeout(r, 500));
        DUMMY_SUBMISSIONS = DUMMY_SUBMISSIONS.filter((d) => d.id !== id);
        return true;
    },
};

function validateForm(form) {
    const err = {};
    if (!form.firstName || form.firstName.trim().length < 2) err.firstName = "First name required (min 2 chars)";
    if (!form.lastName || form.lastName.trim().length < 2) err.lastName = "Last name required (min 2 chars)";
    if (!form.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) err.email = "Valid email required";
    if (!form.age || isNaN(form.age) || form.age < 18 || form.age > 65) err.age = "Age 18-65 required";
    if (!form.post || !POSTS.includes(form.post)) err.post = "Select a valid post";
    if (!form.description || form.description.length < 10) err.description = "Description min 10 chars";
    if (!form.file || !(form.file instanceof File)) err.file = "Resume required";
    else if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(form.file.type))
        err.file = "Only PDF or DOCX allowed";
    return err;
}

function validateEditForm(form) {
    const err = {};
    if (!form.firstName || form.firstName.trim().length < 2) err.firstName = "First name required (min 2 chars)";
    if (!form.lastName || form.lastName.trim().length < 2) err.lastName = "Last name required (min 2 chars)";
    if (!form.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) err.email = "Valid email required";
    if (!form.age || isNaN(form.age) || form.age < 18 || form.age > 65) err.age = "Age 18-65 required";
    if (!form.post || !POSTS.includes(form.post)) err.post = "Select a valid post";
    if (!form.description || form.description.length < 10) err.description = "Description min 10 chars";
    if (form.file && !(form.file.type === "application/pdf" || form.file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
        err.file = "Only PDF or DOCX allowed";
    }
    return err;
}

export default function SinglePage() {
    const [page, setPage] = useState("form");
    const [token, setToken] = useState("");
    const [form, setForm] = useState({});
    const [formErr, setFormErr] = useState({});
    const [formMsg, setFormMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState({ email: "", password: "" });
    const [loginErr, setLoginErr] = useState("");
    const [dashParams, setDashParams] = useState({ search: "", post: "", "age[lt]": "", "age[gt]": "", sort: "creation_date", skip: 0, limit: 10 });
    const [subs, setSubs] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editErr, setEditErr] = useState({});
    const [total, setTotal] = useState(0);

    // Fetch dashboard data
    useEffect(() => {
        if (page === "dashboard" && token) {
            fetchSubs();
        }
        // eslint-disable-next-line
    }, [page, dashParams, token]);

    const fetchSubs = async () => {
        setLoading(true);
        try {
            const { data, total } = await dummyAPI.getSubmissions(dashParams);
            setSubs(data);
            setTotal(total);
        } finally {
            setLoading(false);
        }
    };

    // Submission Form Handlers
    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setForm((f) => ({
            ...f,
            [name]: files ? files[0] : value,
        }));
        setFormErr({});
        setFormMsg("");
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const err = validateForm(form);
        setFormErr(err);
        if (Object.keys(err).length) return;
        setLoading(true);
        try {
            await dummyAPI.createSubmission({
                name: { firstName: form.firstName, lastName: form.lastName },
                email: form.email,
                age: Number(form.age),
                post: form.post,
                description: form.description,
                fileUrl: "#", // Simulate file upload
            });
            setFormMsg("Submission successful!");
            setForm({});
        } catch {
            setFormMsg("Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    // Admin Login Handlers
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLogin((l) => ({ ...l, [name]: value }));
        setLoginErr("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!login.email || !login.password) {
            setLoginErr("Email and password required");
            return;
        }
        setLoading(true);
        try {
            const res = await dummyAPI.login(login);
            setToken(res.token);
            setPage("dashboard");
        } catch (err) {
            setLoginErr("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    // Dashboard Handlers
    const handleDashParam = (e, v) => {
        const { name, value } = e.target || {};
        setDashParams((p) => ({
            ...p,
            [name]: value,
            skip: 0, // Reset to first page on filter/search change
        }));
    };

    const handlePageChange = (e, pageNum) => {
        setDashParams((p) => ({
            ...p,
            skip: (pageNum - 1) * p.limit,
        }));
    };

    // Edit Handlers
    const startEdit = (row) => {
        setEditId(row.id);
        setEditForm({
            firstName: row.name.firstName,
            lastName: row.name.lastName,
            email: row.email,
            age: row.age,
            post: row.post,
            description: row.description,
            file: null,
        });
        setEditErr({});
    };

    const handleEditChange = (e) => {
        const { name, value, files } = e.target;
        setEditForm((f) => ({
            ...f,
            [name]: files ? files[0] : value,
        }));
        setEditErr({});
    };

    const handleEditSubmit = async () => {
        const err = validateEditForm(editForm);
        setEditErr(err);
        if (Object.keys(err).length) return;
        setLoading(true);
        try {
            await dummyAPI.updateSubmission(editId, {
                firstName: editForm.firstName,
                lastName: editForm.lastName,
                email: editForm.email,
                age: Number(editForm.age),
                post: editForm.post,
                description: editForm.description,
                // file: editForm.file, // Not used in dummyAPI, but you can add logic if needed
            });
            setEditId(null);
            fetchSubs();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        await dummyAPI.deleteSubmission(id);
        fetchSubs();
    };

    const fadeIn = (children) => (
        <Fade in timeout={700}>
            <div>{children}</div>
        </Fade>
    );

    return (
        <>
            <Box className="main-bg" minHeight="100vh" display="flex" flexDirection="column" alignItems="center">
                {/* HEADER */}
                <Slide in direction="down" timeout={700}>
                    <Typography variant="h3" className="gradient-text" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
                        Submission Portal
                    </Typography>
                </Slide>
                {/* NAVIGATION BAR */}
                <Box mb={2}>
                    <Button
                        variant={page === "form" ? "contained" : "outlined"}
                        onClick={() => setPage("form")}
                        sx={{ mr: 2 }}
                    >
                        User Submission
                    </Button>
                    <Button
                        variant={page === "login" ? "contained" : "outlined"}
                        onClick={() => setPage("login")}
                    >
                        Admin Login
                    </Button>
                    {token && (
                        <Tooltip title="Logout">
                            <IconButton
                                onClick={() => {
                                    setToken("");
                                    setPage("login");
                                }}
                            >
                                <Logout />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                {/* SUBMISSION FORM */}
                {page === "form" &&
                    fadeIn(
                        <SubmissionForm
                            form={form}
                            formErr={formErr}
                            formMsg={formMsg}
                            loading={loading}
                            handleFormChange={handleFormChange}
                            handleFormSubmit={handleFormSubmit}
                            POSTS={POSTS}
                        />
                    )}
                {/* ADMIN LOGIN */}
                {page === "login" &&
                    fadeIn(
                        <AdminLogin
                            loading={loading}
                            login={login}
                            loginErr={loginErr}
                            handleLoginChange={handleLoginChange}
                            handleLogin={handleLogin}
                        />
                    )}
                {/* ADMIN DASHBOARD */}
                {page === "dashboard" &&
                    fadeIn(
                        <AdminDashboard
                            dashParams={dashParams}
                            handleDashParam={handleDashParam}
                            subs={subs}
                            editId={editId}
                            editForm={editForm}
                            editErr={editErr}
                            handleEditChange={handleEditChange}
                            handleEditSubmit={handleEditSubmit}
                            startEdit={startEdit}
                            setEditId={setEditId}
                            handleDelete={handleDelete}
                            total={total}
                            loading={loading}
                            handlePageChange={handlePageChange}
                            POSTS={POSTS}
                        />
                    )}
            </Box>
        </>
    );
}