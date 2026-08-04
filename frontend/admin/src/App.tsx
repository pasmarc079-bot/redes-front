import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from '@/guards/AuthGuard';
import Login from '@/pages/Login';
import AdminLayout from '@/components/layout/AdminLayout';
import Dashboard from '@/pages/Dashboard';
import EventList from '@/pages/events/EventList';
import EventForm from '@/pages/events/EventForm';
import PostList from '@/pages/blog/PostList';
import PostEditor from '@/pages/blog/PostEditor';
import MediaLibrary from '@/pages/media/MediaLibrary';
import Settings from '@/pages/settings/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <AdminLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Events */}
        <Route path="events" element={<EventList />} />
        <Route path="events/new" element={<EventForm />} />
        <Route path="events/:id" element={<EventForm />} />

        {/* Blog */}
        <Route path="blog" element={<PostList />} />
        <Route path="blog/new" element={<PostEditor />} />
        <Route path="blog/:id" element={<PostEditor />} />

        {/* Media */}
        <Route path="media" element={<MediaLibrary />} />

        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
