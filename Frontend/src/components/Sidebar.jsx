import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, FileText, Map, Shield, ChevronRight, Github, Mail } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-800 text-white h-full flex flex-col shadow-lg">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-400" size={22} />
          <h1 className="text-xl font-bold text-white">
            Bangladesh Surrkha Netro
          </h1>
        </div>
      </div>

      <nav className="flex-1 pt-5 px-3">
        <div className="mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>

        <NavLink
          to="/cams"
          className={({ isActive }) => {
            return `flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`;
          }}
        >
          {({ isActive }) => (
            <>
              <Camera size={18} className="mr-3" />
              <span>CCTV Cameras</span>
              <ChevronRight size={16} className="ml-auto opacity-70" />
            </>
          )}
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) => {
            return `flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`;
          }}
        >
          {({ isActive }) => (
            <>
              <FileText size={18} className="mr-3" />
              <span>Crime Reports</span>
              <ChevronRight size={16} className="ml-auto opacity-70" />
            </>
          )}
        </NavLink>

        <NavLink
          to="/crime-maps"
          className={({ isActive }) => {
            return `flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`;
          }}
        >
          {({ isActive }) => (
            <>
              <Map size={18} className="mr-3" />
              <span>Crime Maps</span>
              <ChevronRight size={16} className="ml-auto opacity-70" />
            </>
          )}
        </NavLink>

        <NavLink
          to="/possible-crime-spots"
          className={({ isActive }) => {
            return `flex items-center px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`;
          }}
        >
          {({ isActive }) => (
            <>
              <Shield size={18} className="mr-3" />
              <span>Possible Crime Spots</span>
              <ChevronRight size={16} className="ml-auto opacity-70" />
            </>
          )}
        </NavLink>
      </nav>

      <div className="mt-auto p-4 border-t border-slate-700 text-xs text-slate-400">
        <p className="text-center mb-2">© 2025 Bangladesh Surrkha Netro</p>
        <div className="flex items-center justify-center gap-3">
          <a href="https://github.com/swahinbiswas" className="flex items-center text-slate-400 hover:text-blue-400 transition-colors">
            <Github size={14} className="mr-1" />
            <span>swahinbiswas</span>
          </a>
          <a href="mailto:swahinbiswas.cse@gmail.com" className="flex items-center text-slate-400 hover:text-blue-400 transition-colors">
            <Mail size={14} className="mr-1" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;