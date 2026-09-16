import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Users as UsersIcon, 
  Eye, 
  Mail, 
  Phone,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../../types';
import { Pagination } from '../common/Pagination';
import { EmptyState } from '../common/EmptyState';
import { getUsers, mapAdminUserToUser } from '../../lib/adminUserApi';
import { ApiError } from '../../lib/apiClient';

interface UsersViewProps {
  onViewUser: (user: User) => void;
}

type SortOption = 'newest' | 'name-asc' | 'name-desc' | 'oldest';

export const UsersView: React.FC<UsersViewProps> = ({ onViewUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [users, setUsers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getUsers({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        sort: sortBy,
      });

      setUsers(result.users.map(mapAdminUserToUser));
      setTotalItems(result.pagination.total);
    } catch (fetchError) {
      const message =
        fetchError instanceof ApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load customers';

      setError(message);
      setUsers([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, sortBy]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const formatJoinedDate = (dateValue: string) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8E2D5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#173D2A] font-serif-brand">
              Customer Directory & CRM
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#173D2A] text-xs font-medium border border-[#E5DEC9]">
              {totalItems} Customers
            </span>
          </div>
          <p className="text-xs text-[#736854] mt-0.5">
            Manage registered customers from the live database with server-side search and pagination.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by name, email, or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] placeholder-[#8F816B] focus:outline-none focus:border-[#173D2A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#736854] whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs font-medium bg-white border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
          >
            <option value="newest">Recently Joined</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchUsers}
            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-200 rounded-xl inline-flex items-center gap-1.5 hover:bg-red-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs p-12 flex flex-col items-center justify-center gap-3 text-[#736854]">
          <Loader2 className="w-8 h-8 animate-spin text-[#173D2A]" />
          <p className="text-sm font-medium">Loading customers...</p>
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={debouncedSearch ? 'No Customers Match Query' : 'No Customers Found'}
          description={
            debouncedSearch
              ? 'Try modifying your search criteria or clear the search input.'
              : 'No registered customers were found in the database.'
          }
          actionLabel={debouncedSearch ? 'Clear Search' : undefined}
          onAction={debouncedSearch ? () => setSearchQuery('') : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#5C5343]">
              <thead className="bg-[#F9F7F2] text-[#736854] font-medium uppercase tracking-wider border-b border-[#E8E2D5]">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE0]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#173D2A] text-[#D99B26] font-medium text-sm flex items-center justify-center border border-[#D99B26]/30">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-[#1A211D]">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-[#8F816B]">
                            ID: #{user.id.substring(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-[#1A211D]">
                          <Mail className="w-3.5 h-3.5 text-[#8F816B]" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#736854]">
                          <Phone className="w-3 h-3 text-[#8F816B]" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          user.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#736854]">
                      {formatJoinedDate(user.joinedDate)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onViewUser(user)}
                        className="px-3 py-1.5 text-xs font-medium text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#DCD4C0] rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-[#E8E2D5] bg-[#F9F7F2]">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50]}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
