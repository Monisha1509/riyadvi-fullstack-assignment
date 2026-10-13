import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const lazyContentPage = (name) => lazy(() => import('./pages/Pages.jsx').then((module) => ({ default: module[name] })));
const Services = lazyContentPage('Services');
const ServiceDetail = lazyContentPage('ServiceDetail');
const Portfolio = lazyContentPage('Portfolio');
const CaseStudy = lazyContentPage('CaseStudy');
const About = lazyContentPage('About');
const Blog = lazyContentPage('Blog');
const BlogDetail = lazyContentPage('BlogDetail');
const Careers = lazyContentPage('Careers');
const JobDetail = lazyContentPage('JobDetail');
const Contact = lazyContentPage('Contact');
const Consultation = lazyContentPage('Consultation');
const HealthCheck = lazyContentPage('HealthCheck');
const LeadGuide = lazyContentPage('LeadGuide');
const NotFound = lazyContentPage('NotFound');
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

function LoadingPage() {
  return <div className="route-loading" role="status" aria-live="polite">Loading page…</div>;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<CaseStudy />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="careers" element={<Careers />} />
          <Route path="careers/:slug" element={<JobDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="consultation" element={<Consultation />} />
          <Route path="business-health-checkup" element={<HealthCheck />} />
          <Route path="software-project-planning-guide" element={<LeadGuide />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
