import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          courses: path.resolve(__dirname, 'courses.html'),
          cybersecurity: path.resolve(__dirname, 'cybersecurity.html'),
          softwareDevelopment: path.resolve(__dirname, 'software-development.html'),
          aiData: path.resolve(__dirname, 'ai-data.html'),
          networking: path.resolve(__dirname, 'networking.html'),
          cloudDevops: path.resolve(__dirname, 'cloud-devops.html'),
          roboticsIot: path.resolve(__dirname, 'robotics-iot.html'),
          governmentExams: path.resolve(__dirname, 'government-exams.html'),
          blogs: path.resolve(__dirname, 'blogs.html'),
          workshops: path.resolve(__dirname, 'workshops.html'),
          about: path.resolve(__dirname, 'about.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
  };
});
