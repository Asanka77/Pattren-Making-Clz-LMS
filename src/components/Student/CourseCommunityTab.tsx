import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Plus,
  Sparkles,
  HelpCircle,
  Award,
  Pin,
  X,
  Share2,
  Image as ImageIcon,
  CheckCircle,
  User,
  Shield,
  Layers,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CommunityPost, CommunityComment } from '../../types';

interface CourseCommunityTabProps {
  courseId: string;
  courseTitle: string;
}

export const CourseCommunityTab: React.FC<CourseCommunityTabProps> = ({
  courseId,
  courseTitle,
}) => {
  const { studentUser, isAdmin, user } = useAuth();
  const {
    communityPosts,
    createCommunityPost,
    toggleLikeCommunityPost,
    addCommentToCommunityPost,
    deleteCommunityPost,
  } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPostingModalOpen, setIsPostingModalOpen] = useState<boolean>(false);
  const [activePostForComments, setActivePostForComments] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Form state for new post
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<CommunityPost['category']>('QUESTION');
  const [newPostMonth, setNewPostMonth] = useState<number>(1);
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STRICT STUDENT DATA ISOLATION: Only posts belonging to this specific course
  const coursePosts = useMemo(() => {
    return communityPosts.filter((p) => p.courseId === courseId);
  }, [communityPosts, courseId]);

  const filteredPosts = useMemo(() => {
    return coursePosts.filter((p) => {
      if (activeCategory !== 'ALL' && p.category !== activeCategory) return false;
      if (selectedMonthFilter !== 0 && p.month !== selectedMonthFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchContent = p.content.toLowerCase().includes(q);
        const matchAuthor = p.authorName.toLowerCase().includes(q);
        return matchTitle || matchContent || matchAuthor;
      }
      return true;
    });
  }, [coursePosts, activeCategory, selectedMonthFilter, searchQuery]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    setIsSubmitting(true);
    try {
      const authorRole = isAdmin ? 'ADMIN' : 'STUDENT';
      const authorName = studentUser?.fullName || user?.displayName || 'Academy Member';
      const authorReg = studentUser?.regNumber || (isAdmin ? 'ACADEMY-DEAN' : undefined);
      const authorId = studentUser?.id || user?.uid || 'user-' + Date.now();

      await createCommunityPost({
        courseId,
        courseTitle,
        month: newPostMonth,
        authorId,
        authorName,
        authorRole,
        authorRegNumber: authorReg,
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        category: newPostCategory,
        imageUrl: newPostImageUrl.trim() || undefined,
        tags: [`Month0${newPostMonth}`, newPostCategory],
        isPinned: false,
      });

      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImageUrl('');
      setIsPostingModalOpen(false);
    } catch (err) {
      console.error('Failed to create community post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const authorRole = isAdmin ? 'ADMIN' : 'STUDENT';
    const authorName = studentUser?.fullName || user?.displayName || 'Academy Member';
    const authorReg = studentUser?.regNumber || (isAdmin ? 'ACADEMY-DEAN' : undefined);
    const authorId = studentUser?.id || user?.uid || 'user-' + Date.now();

    await addCommentToCommunityPost(postId, {
      authorId,
      authorName,
      authorRole,
      authorRegNumber: authorReg,
      content: text,
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const currentUserId = studentUser?.id || user?.uid || 'guest';

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-300">
      {/* Community Banner & Call-to-Action */}
      <div className="p-6 rounded-sm bg-gradient-to-r from-[#1c1214] via-[#241317] to-[#141011] border border-[#dfb56c]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#dfb56c] font-bold">
              PEER LEARNING &amp; MENTOR DISCUSSIONS
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-green-950 text-green-300 border border-green-500/40">
              Live Firestore Sync
            </span>
          </div>
          <h3 className="text-xl font-editorial font-bold text-[#f7f3eb] mt-1">
            {courseTitle} • Atelier Community
          </h3>
          <p className="text-xs text-[#d5cfc4] font-sinhala mt-0.5 max-w-xl">
            ඔබගේ පැටර්න් ඇඳීම්, මැහුම් ගැටළු සහ විලාසිතා නිර්මාණ පිළිබඳ ප්‍රශ්න යොමු කරන්න. උපදේශකවරුන් සහ සිසුන් සමඟ අදහස් හුවමාරු කරගන්න.
          </p>
        </div>

        <button
          onClick={() => setIsPostingModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 fill-black" />
          <span>New Discussion Post</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0c090a] p-3 rounded-sm border border-white/10">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Discussions' },
            { id: 'QUESTION', label: 'Questions (ප්‍රශ්න)' },
            { id: 'SHOWCASE', label: 'Student Showcases (නිර්මාණ)' },
            { id: 'TECHNIQUE', label: 'Techniques (තාක්ෂණය)' },
            { id: 'ANNOUNCEMENT', label: 'Announcements (නිවේදන)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] font-bold shadow-md'
                  : 'text-[#a89f91] hover:text-white bg-black/40 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#a89f91] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-sm text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none font-sans"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-10 rounded-sm bg-[#0c090a] border border-white/10 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-[#dfb56c] mx-auto opacity-50" />
            <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
              No Discussions Found
            </h4>
            <p className="text-xs text-[#a89f91] font-sinhala">
              මෙම අංශයට අදාළව තවම ප්‍රශ්න හෝ සටහන් එක්කර නැත. මුල්ම සාකච්ඡාව ආරම්භ කිරීමට ඉහත බොත්තම ඔබන්න!
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const hasLiked = post.likedBy?.includes(currentUserId);
            const isCommentsOpen = activePostForComments === post.id;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-sm bg-[#0c090a] border transition-all ${
                  post.isPinned
                    ? 'border-[#dfb56c] shadow-lg shadow-[#540d18]/20 bg-gradient-to-b from-[#180e11] to-[#0c090a]'
                    : 'border-white/10 hover:border-[#dfb56c]/50'
                }`}
              >
                {/* Header: Author & Meta */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#540d18] border border-[#dfb56c]/60 flex items-center justify-center text-[#dfb56c] font-bold text-xs shrink-0">
                      {post.authorRole === 'ADMIN' ? (
                        <Shield className="w-4 h-4 text-[#dfb56c]" />
                      ) : (
                        <User className="w-4 h-4 text-[#f7e2a9]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs sm:text-sm font-semibold text-[#f7f3eb]">
                          {post.authorName}
                        </strong>
                        {post.authorRole === 'MENTOR' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#dfb56c] text-black font-bold">
                            FACULTY MENTOR
                          </span>
                        )}
                        {post.authorRole === 'ADMIN' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-950 text-red-300 border border-red-500 font-bold">
                            ADMIN
                          </span>
                        )}
                        {post.authorRegNumber && (
                          <span className="text-[10px] font-mono text-[#a89f91]">
                            ({post.authorRegNumber})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#a89f91] font-mono mt-0.5">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-[#dfb56c]">Month 0{post.month || 1}</span>
                        <span>•</span>
                        <span className="uppercase">{post.category}</span>
                      </div>
                    </div>
                  </div>

                  {post.isPinned && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#dfb56c]/10 text-[#dfb56c] border border-[#dfb56c]/40 flex items-center gap-1 shrink-0">
                      <Pin className="w-3 h-3 fill-current" /> Pinned
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h4 className="text-base sm:text-lg font-editorial font-bold text-[#f7f3eb] leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#d5cfc4] whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>

                  {/* Optional Image */}
                  {post.imageUrl && (
                    <div className="mt-3 rounded overflow-hidden border border-white/10 max-h-96 bg-black">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto max-h-96 object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>

                {/* Action Bar: Likes, Comments Toggle */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLikeCommunityPost(post.id, currentUserId)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border transition-all ${
                        hasLiked
                          ? 'bg-[#540d18] border-[#dfb56c] text-[#dfb56c] font-bold'
                          : 'bg-black/50 border-white/10 text-[#a89f91] hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                      <span>{post.likesCount || 0} Likes</span>
                    </button>

                    <button
                      onClick={() =>
                        setActivePostForComments((prev) => (prev === post.id ? null : post.id))
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-black/50 border border-white/10 text-[#a89f91] hover:text-white transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#dfb56c]" />
                      <span>{post.comments?.length || 0} Comments</span>
                    </button>
                  </div>

                  {(isAdmin || studentUser?.id === post.authorId) && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this community post?')) {
                          deleteCommunityPost(post.id);
                        }
                      }}
                      className="text-[11px] text-red-400 hover:text-red-300 underline"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Expandable Comment Section */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 bg-black/40 p-4 rounded-sm">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold block">
                      Discussion Thread ({post.comments?.length || 0})
                    </span>

                    {/* Existing Comments */}
                    <div className="space-y-2.5">
                      {(!post.comments || post.comments.length === 0) ? (
                        <p className="text-xs text-[#a89f91] italic">
                          No replies yet. Be the first to share your insights!
                        </p>
                      ) : (
                        post.comments.map((c) => (
                          <div
                            key={c.id}
                            className={`p-3 rounded-sm border text-xs space-y-1 ${
                              c.authorRole === 'MENTOR' || c.authorRole === 'ADMIN'
                                ? 'bg-[#1e1316] border-[#dfb56c]/40'
                                : 'bg-[#141011] border-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <strong className="text-[#f7f3eb]">{c.authorName}</strong>
                                {c.authorRole === 'MENTOR' && (
                                  <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-[#dfb56c] text-black font-bold">
                                    FACULTY
                                  </span>
                                )}
                                {c.authorRegNumber && (
                                  <span className="text-[10px] text-[#a89f91]">
                                    ({c.authorRegNumber})
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#a89f91] font-mono">
                                {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[#d5cfc4] leading-relaxed whitespace-pre-wrap">
                              {c.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        placeholder="Write a reply or answer..."
                        className="flex-1 px-3 py-2 bg-black border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm flex items-center gap-1 hover:bg-[#6e1322] cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* New Post Modal Form */}
      <AnimatePresence>
        {isPostingModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-[#141011] border-2 border-[#dfb56c] rounded-sm p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#dfb56c]" />
                  <h4 className="text-base font-editorial font-bold text-[#f7f3eb]">
                    Create E-Learning Community Discussion
                  </h4>
                </div>
                <button
                  onClick={() => setIsPostingModalOpen(false)}
                  className="p-1 text-[#a89f91] hover:text-white rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[#a89f91] uppercase font-mono mb-1">
                    Discussion Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="e.g., Question on Bodice Apex Dart Manipulation in Month 02"
                    className="w-full px-3 py-2 bg-black border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a89f91] uppercase font-mono mb-1">
                      Category *
                    </label>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-black border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
                    >
                      <option value="QUESTION">Question (ප්‍රශ්නයක්)</option>
                      <option value="SHOWCASE">Student Showcase (නිර්මාණයක්)</option>
                      <option value="TECHNIQUE">Technique Discussion (තාක්ෂණික)</option>
                      <option value="ANNOUNCEMENT">Announcement (නිවේදනය)</option>
                      <option value="GENERAL">General Discussion (සාමාන්‍ය)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#a89f91] uppercase font-mono mb-1">
                      Related Curriculum Month
                    </label>
                    <select
                      value={newPostMonth}
                      onChange={(e) => setNewPostMonth(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-black border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((m) => (
                        <option key={m} value={m}>
                          Month 0{m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#a89f91] uppercase font-mono mb-1">
                    Details &amp; Notes *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Describe your design question, sewing challenge, or showcase details..."
                    className="w-full px-3 py-2 bg-black border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[#a89f91] uppercase font-mono mb-1">
                    Optional Photo / Blueprint Image URL
                  </label>
                  <input
                    type="url"
                    value={newPostImageUrl}
                    onChange={(e) => setNewPostImageUrl(e.target.value)}
                    placeholder="https://... image URL of your garment or pattern"
                    className="w-full px-3 py-2 bg-black border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsPostingModalOpen(false)}
                    className="px-4 py-2 border border-white/10 rounded-sm text-xs text-[#a89f91] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#540d18] border border-[#dfb56c] text-[#f7e2a9] text-xs font-bold rounded-sm hover:bg-[#6e1322] flex items-center gap-1.5 shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Posting...' : 'Publish to Course'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
