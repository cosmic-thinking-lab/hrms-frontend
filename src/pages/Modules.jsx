import React from 'react';
import { Target, Users, Zap, Briefcase, ChevronRight, BarChart3, Clock, CheckCircle2, Plane, Heart, ShieldQuestion } from 'lucide-react';

const GenericPortalPage = ({ title, icon: Icon, description, stats, items }) => {
    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-primary-500 rounded-lg text-white">
                            <Icon size={20} />
                        </div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">{title}</h1>
                    </div>
                    <p className="text-neutral-500 font-medium">{description}</p>
                </div>
                <div className="flex space-x-4">
                    <button className="px-6 py-3 bg-neutral-900 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-xl hover:bg-neutral-800 transition-all">
                        Export Data
                    </button>
                    <button className="px-6 py-3 bg-primary-500 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all">
                        New Entry
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500-5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                        <p className="text-10px font-black text-neutral-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <p className="text-4xl font-black text-neutral-900 mb-1">{stat.value}</p>
                        <p className="text-11px font-bold text-emerald-500">{stat.trend}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2-5rem border border-neutral-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="px-10 py-8 border-b border-neutral-50 bg-[#fdfdfd] flex justify-between items-center">
                    <h3 className="font-black text-neutral-900 text-lg uppercase tracking-wider">Operational Overview</h3>
                    <div className="flex space-x-2">
                        {['All', 'Active', 'Archived'].map(t => (
                            <button key={t} className="px-4 py-2 text-10px font-black uppercase tracking-widest text-neutral-400 hover:text-primary-500 transition-all">{t}</button>
                        ))}
                    </div>
                </div>
                <div className="divide-y divide-neutral-50 px-10">
                    {items.map((item, i) => (
                        <div key={i} className="py-6 flex items-center justify-between group hover:bg-neutral-50 -mx-10 px-10 transition-all cursor-pointer">
                            <div className="flex items-center space-x-6">
                                <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 font-black group-hover:bg-neutral-900 group-hover:text-white transition-all">
                                    {i + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-900 mb-1">{item.title}</h4>
                                    <p className="text-10px font-bold text-neutral-400 uppercase tracking-widest flex items-center">
                                        <Clock size={12} className="mr-1.5" /> Due in {i + 1} days
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-8">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-neutral-900 tracking-tight">{item.subtitle}</p>
                                    <p className="text-10px font-bold text-neutral-400 uppercase tracking-widest">{item.status}</p>
                                </div>
                                <button className="p-2 transition-all group-hover:translate-x-1">
                                    <ChevronRight size={20} className="text-neutral-300" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Onboarding = () => (
    <GenericPortalPage
        title="Onboarding"
        icon={Zap}
        description="Streamlining the journey for new hires into your corporate culture."
        stats={[
            { label: 'New Hires', value: '14', trend: '+3 this week' },
            { label: 'Completion Rate', value: '92%', trend: 'Strong engagement' },
            { label: 'Pending Docs', value: '08', trend: '2 urgent' }
        ]}
        items={[
            { title: 'Sarah Jenkins - Product', subtitle: 'Hardware setup', status: 'In Progress' },
            { title: 'Michael Chen - Eng', subtitle: 'ID Card processing', status: 'Queued' },
            { title: 'Aisha Gupta - Design', subtitle: 'Welcome package', status: 'Pending' }
        ]}
    />
);

export const Recruitment = () => (
    <GenericPortalPage
        title="Recruitment"
        icon={Target}
        description="Source, track, and hire the best talent globally."
        stats={[
            { label: 'Open Positions', value: '12', trend: 'across 4 depts' },
            { label: 'Total Apps', value: '342', trend: '+54 today' },
            { label: 'Interviewing', value: '18', trend: '3 scheduled today' }
        ]}
        items={[
            { title: 'Senior Backend Engineer', subtitle: 'Pipeline: 12 interviews', status: 'Active' },
            { title: 'UX Research Lead', subtitle: 'Pipeline: 05 interviews', status: 'Final Stage' },
            { title: 'Marketing Manager', subtitle: 'Pipeline: 24 apps', status: 'Sourcing' }
        ]}
    />
);

export const Performance = () => (
    <GenericPortalPage
        title="Performance"
        icon={Heart}
        description="Driving growth through continuous feedback and objective tracking."
        stats={[
            { label: 'Review Cycle', value: 'Q1', trend: '98% completed' },
            { label: 'High Achievers', value: '24', trend: 'Recognition ready' },
            { label: 'Goal Progress', value: '88%', trend: 'On track' }
        ]}
        items={[
            { title: 'Quarterly OKRs Review', subtitle: 'Development Team', status: 'Finalized' },
            { title: 'Peer Feedback Session', subtitle: 'Marketing Department', status: 'Active' },
            { title: 'Manager 1-on-1s', subtitle: 'Support Unit', status: 'Upcoming' }
        ]}
    />
);

export const Travel = () => (
    <GenericPortalPage
        title="Travel"
        icon={Plane}
        description="Managing business travel, expenses, and global mobility."
        stats={[
            { label: 'Active Trips', value: '04', trend: 'International' },
            { label: 'Expense Claims', value: '$2.4k', trend: 'Pending audit' },
            { label: 'Policy Sync', value: '100%', trend: 'Compliant' }
        ]}
        items={[
            { title: 'Design Conf 2026 - Berlin', subtitle: 'Attendee: Sarah J.', status: 'Booked' },
            { title: 'Regional Meetup - Mumbai', subtitle: 'Attendee: Raj K.', status: 'Pending Approval' },
            { title: 'Sales Summit - London', subtitle: 'Attendee: Alex P.', status: 'Expenses Filed' }
        ]}
    />
);

export const Tasks = () => (
    <GenericPortalPage
        title="Tasks"
        icon={CheckCircle2}
        description="Centralized project collaboration and task tracking."
        stats={[
            { label: 'Open Tasks', value: '156', trend: '24 high priority' },
            { label: 'Completed', value: '84', trend: 'This month' },
            { label: 'Efficiency', value: '+14%', trend: 'Improved vs Q4' }
        ]}
        items={[
            { title: 'Compliance Audit Phase 2', subtitle: 'Owner: Legal Dept', status: 'In Progress' },
            { title: 'Vendor Security Review', subtitle: 'Owner: IT Ops', status: 'High Priority' },
            { title: 'Office Expansion Project', subtitle: 'Owner: Fac. Mgmt', status: 'Planning' }
        ]}
    />
);

export const IntegrationHelp = () => (
    <GenericPortalPage
        title="Help Centre"
        icon={ShieldQuestion}
        description="Get support, read documentation, or contact technical experts."
        stats={[
            { label: 'Tickets Open', value: '02', trend: 'Response < 5min' },
            { label: 'SLA Health', value: '100%', trend: 'Exceptional' },
            { label: 'Articles', value: '254', trend: 'Self-serve library' }
        ]}
        items={[
            { title: 'Setup Guide - Global Payroll', subtitle: 'Documentation', status: 'Read' },
            { title: 'SSO Configuration Tutorial', subtitle: 'Technical Guide', status: 'Updated' },
            { title: 'Billing & Invoice Policy', subtitle: 'Global Policy', status: 'PDF' }
        ]}
    />
);
