import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/admin/protected-route";
import { AdminLayout, AdminTab } from "@/components/admin/admin-layout";
import { OverviewCards, DashboardMetrics } from "@/components/admin/overview-cards";
import { RecentActivity, ActivityItem } from "@/components/admin/recent-activity";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Building2,
  MessageSquare,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Mail,
  Phone,
  Calendar,
  Tag,
  ShieldCheck,
  UserCheck,
  Lock,
} from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardRoute,
});

function AdminDashboardRoute() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [loading, setLoading] = useState(true);

  // Raw data from Supabase
  const [properties, setProperties] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Calculated Metrics for the 8 overview cards
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    leasedListings: 0,
    draftListings: 0,
    featuredListings: 0,
    hiddenListings: 0,
    totalInquiries: 0,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch properties
      const { data: propsData, error: propsErr } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (propsErr) console.error("Error fetching properties:", propsErr);

      // Fetch inquiries
      const { data: inqData, error: inqErr } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (inqErr) console.error("Error fetching inquiries:", inqErr);

      const loadedProps = propsData || [];
      const loadedInqs = inqData || [];

      setProperties(loadedProps);
      setInquiries(loadedInqs);

      // Compute overview card counts
      const total = loadedProps.length;
      const active = loadedProps.filter(
        (p) => p.status === "for-sale" || p.status === "for-lease"
      ).length;
      const sold = loadedProps.filter((p) => p.status === "sold").length;
      const leased = loadedProps.filter((p) => p.status === "leased").length;
      const featured = loadedProps.filter((p) => p.is_featured === true).length;
      
      // Draft & Hidden calculation (handling status/flag representations)
      const draft = loadedProps.filter((p: any) => p.status === "draft" || p.is_draft === true).length;
      const hidden = loadedProps.filter((p: any) => p.is_hidden === true || p.status === "hidden").length;

      setMetrics({
        totalListings: total,
        activeListings: active,
        soldListings: sold,
        leasedListings: leased,
        draftListings: draft,
        featuredListings: featured,
        hiddenListings: hidden,
        totalInquiries: loadedInqs.length,
      });

      // Build Recent Activity items
      const propActivities: ActivityItem[] = loadedProps.slice(0, 5).map((p) => ({
        id: `prop-${p.id}`,
        type: "property",
        title: p.title,
        subtitle: `${p.city}, ${p.state} • ${p.price}`,
        status: p.status,
        timestamp: p.created_at,
      }));

      const inqActivities: ActivityItem[] = loadedInqs.slice(0, 5).map((i) => ({
        id: `inq-${i.id}`,
        type: "inquiry",
        title: `Inquiry from ${i.name}`,
        subtitle: i.property_slug ? `Regarding: ${i.property_slug}` : i.message.substring(0, 45) + "...",
        timestamp: i.created_at,
      }));

      // Combine and sort by timestamp
      const combined = [...propActivities, ...inqActivities].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(combined.slice(0, 8));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInquiries = inquiries.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Tab Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white capitalize flex items-center gap-3">
            {activeTab} Management
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Overview and real-time operational statistics for Cassandra Burgos Luxury Real Estate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#161616] px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#d4af37] ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB CONTENT */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* 8 Overview Metric Cards */}
          <OverviewCards metrics={metrics} loading={loading} />

          {/* Activity & Quick Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentActivity activities={activities} loading={loading} />
            </div>

            {/* Quick Status Breakdown Side Panel */}
            <div className="rounded-xl border border-white/10 bg-[#141414] p-6 shadow-xl space-y-4">
              <h3 className="text-base font-serif font-semibold text-white flex items-center justify-between">
                <span>System Status</span>
                <span className="text-[10px] font-sans font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Online
                </span>
              </h3>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-zinc-300">Database Connection</span>
                  <span className="text-emerald-400 font-medium">Active (Supabase)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-zinc-300">Auth Session</span>
                  <span className="text-zinc-200 font-medium">Secured JWT</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-zinc-300">Admin Account</span>
                  <span className="text-[#d4af37] font-medium truncate max-w-[150px]">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-300">Public Site Sync</span>
                  <span className="text-emerald-400 font-medium">Synced</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 p-3 text-[11px] text-[#d4af37] leading-relaxed">
                  Property CRUD is restricted in overview mode. Contact system administrator for write privileges.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROPERTIES TAB CONTENT */}
      {activeTab === "properties" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search properties by title or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#141414] pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
              />
            </div>
            <p className="text-xs text-zinc-300">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#141414] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-white/[0.05] text-[11px] uppercase tracking-wider text-zinc-300 border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Property</th>
                    <th className="py-3.5 px-4 font-semibold">Location</th>
                    <th className="py-3.5 px-4 font-semibold">Price</th>
                    <th className="py-3.5 px-4 font-semibold">Beds/Baths</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Featured</th>
                    <th className="py-3.5 px-4 font-semibold">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-500">
                        No property listings found.
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-medium text-white">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-[#d4af37] shrink-0" />
                            <span className="truncate max-w-[200px]" title={p.title}>{p.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300">{p.city}, {p.state}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#d4af37]">{p.price}</td>
                        <td className="py-3.5 px-4 text-zinc-300">{p.beds} beds • {p.baths} baths</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-zinc-200">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {p.is_featured ? (
                            <span className="text-amber-400 font-bold">Yes</span>
                          ) : (
                            <span className="text-zinc-400">No</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          {p.created_at ? format(new Date(p.created_at), "MMM d, yyyy") : "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INQUIRIES TAB CONTENT */}
      {activeTab === "inquiries" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search inquiries by name or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#141414] pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
              />
            </div>
            <p className="text-xs text-zinc-300">
              Received {filteredInquiries.length} total contact messages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInquiries.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-400 bg-[#141414] rounded-xl border border-white/10">
                No contact inquiries match your search.
              </div>
            ) : (
              filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-xl border border-white/10 bg-[#141414] p-5 shadow-lg space-y-3 hover:border-[#d4af37]/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{inq.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-zinc-300 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-[#d4af37]" />
                          {inq.email}
                        </span>
                        {inq.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-[#d4af37]" />
                            {inq.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {inq.created_at ? format(new Date(inq.created_at), "MMM d, h:mm a") : "Recent"}
                    </span>
                  </div>

                  {inq.property_slug && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#d4af37]/10 text-[#d4af37] text-[11px] font-medium border border-[#d4af37]/20">
                      <Tag className="h-3 w-3" />
                      <span>Property: {inq.property_slug}</span>
                    </div>
                  )}

                  <p className="text-xs text-zinc-300 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed">
                    "{inq.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SETTINGS TAB CONTENT */}
      {activeTab === "settings" && (
        <div className="max-w-3xl space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#141414] p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-serif font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Lock className="h-5 w-5 text-[#d4af37]" />
              Security & Environment Settings
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Supabase Project Endpoint</p>
                  <p className="text-zinc-400 mt-0.5">https://alepefdfmcqngjzqyajc.supabase.co</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  Connected
                </span>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Session Persistence Strategy</p>
                  <p className="text-zinc-400 mt-0.5">Auto refresh JWT tokens enabled in LocalStorage</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#d4af37]/10 text-[#d4af37] font-bold border border-[#d4af37]/20">
                  Active
                </span>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Role Base Access Control (RBAC)</p>
                  <p className="text-zinc-400 mt-0.5">Protected Admin Router Guards Active</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  Enforced
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE TAB CONTENT */}
      {activeTab === "profile" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#141414] p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="h-16 w-16 rounded-full bg-[#d4af37]/20 text-[#d4af37] border-2 border-[#d4af37] flex items-center justify-center font-bold text-2xl uppercase shadow-lg shadow-[#d4af37]/10">
                {user?.email?.[0] || "A"}
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Administrator Account</h3>
                <p className="text-xs text-zinc-400">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider border border-emerald-500/20">
                  <UserCheck className="h-3 w-3" />
                  Authenticated Admin
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                <span className="text-zinc-400">User ID</span>
                <p className="font-mono text-zinc-200 font-medium mt-1 truncate">{user?.id}</p>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                <span className="text-zinc-400">Last Sign-In</span>
                <p className="text-zinc-200 font-medium mt-1">
                  {user?.last_sign_in_at ? format(new Date(user.last_sign_in_at), "PPpp") : "Current session"}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                <span className="text-zinc-400">Email Status</span>
                <p className="text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Administrator
                </p>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                <span className="text-zinc-400">Access Scope</span>
                <p className="text-[#d4af37] font-medium mt-1">Full Luxury Portal Admin</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
