# Routing & RBAC (Frontend)

## Top-level tree

```
<App>
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public — open to all */}
        <Route element={<PublicLayout/>}>
          <Route path="/"                 element={<Home/>} />
          <Route path="/about"            element={<About/>} />
          <Route path="/departments"      element={<Departments/>} />
          <Route path="/departments/:slug" element={<DepartmentDetail/>} />
          <Route path="/faculty/:id"      element={<FacultyProfile/>} />
          {/* ... rest of public pages */}
          <Route path="/login"            element={<Login/>} />
        </Route>

        {/* Dashboard — requires auth + role match */}
        <Route element={<PrivateRoutes/>}>
          <Route element={<DashboardLayout/>}>
            <Route element={<RoleBasedRoutes/>}>
              {/* Admin subtree */}
              <Route path="/admin/*"     element={<AdminTree/>} />
              <Route path="/exam/*"      element={<ExamTree/>} />
              <Route path="/placement/*" element={<PlacementTree/>} />
              <Route path="/hod/*"       element={<HodTree/>} />
              <Route path="/teacher/*"   element={<TeacherTree/>} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
</App>
```

## PrivateRoutes

```jsx
const { token } = useAuth();
const location = useLocation();
if (!token) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
return <Outlet/>;
```

## RoleBasedRoutes

When a user lands on a dashboard URL:
- If `pathname` starts with the role's prefix (`/admin` for CENTRAL_ADMIN, etc.), render `<Outlet/>`.
- Else, redirect to that role's dashboard home (`/admin/dashboard`, `/hod/dashboard`, ...).

```jsx
const { user } = useAuth();
const prefix = ROLE_TO_PREFIX[user.role];   // map: CENTRAL_ADMIN -> '/admin', HOD -> '/hod', ...
if (!location.pathname.startsWith(prefix)) {
  return <Navigate to={`${prefix}/dashboard`} replace />;
}
return <Outlet/>;
```

## After-login redirect

In `Login.jsx`:
```jsx
const nextParam = new URLSearchParams(location.search).get('next');
const fallback = ROLE_TO_PREFIX[user.role] + '/dashboard';
navigate(nextParam && isSafeNext(nextParam) ? nextParam : fallback, { replace: true });
```

`isSafeNext(path)` — must start with `/`, must not start with `//`, must not contain `:`. Prevents open redirect.

## Token storage

`localStorage.setItem('cw_token', token)` on login. `AuthProvider` reads it on mount via `loadFromStorage()`.

> v2: migrate to httpOnly cookie + CSRF token. Tracked in `../05-roadmap/`.

## Axios interceptor

```js
axiosInstance.interceptors.request.use(cfg => {
  const t = localStorage.getItem('cw_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

axiosInstance.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cw_token');
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    return Promise.reject(err);
  }
);
```

## Constants

`utils/constants.js`:

```js
export const ROLES = {
  CENTRAL_ADMIN: 'CENTRAL_ADMIN',
  EXAM_CONTROLLER: 'EXAM_CONTROLLER',
  PLACEMENT_OFFICER: 'PLACEMENT_OFFICER',
  HOD: 'HOD',
  TEACHER: 'TEACHER',
};

export const ROLE_TO_PREFIX = {
  CENTRAL_ADMIN: '/admin',
  EXAM_CONTROLLER: '/exam',
  PLACEMENT_OFFICER: '/placement',
  HOD: '/hod',
  TEACHER: '/teacher',
};

export const STATUS = { ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE', DRAFT: 'DRAFT', PUBLISHED: 'PUBLISHED', ARCHIVED: 'ARCHIVED' };
```

Never inline role strings outside this file.
