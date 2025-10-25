import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Event, Comment } from 'home/store';
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useCheckFavoriteStatusQuery,
  useToggleFavoriteMutation,
  useRegisterForEventMutation,
} from 'home/store';
import avatar from '../assets/avatar.png';
import { formatVietnamTime } from '../utils/format-time';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState('');

  // Fetch favorite status using RTK Query
  const { data: favoriteData } = useCheckFavoriteStatusQuery({
    eventId: event._id,
  });

  const like = favoriteData?.data?.liked || false;

  // Fetch comments using RTK Query
  const { data: commentsData } = useGetCommentsQuery(
    {
      eventId: event._id,
      status: 'active',
    },
    {
      skip: !openComment, // Only fetch when comments section is open
    },
  );

  const comments = commentsData?.data || [];

  const [createComment] = useCreateCommentMutation();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [registerEvent] = useRegisterForEventMutation();

  // Handle like/unlike
  const handleLike = async () => {
    try {
      await toggleFavorite({ eventId: event._id }).unwrap();
    } catch (error) {
      console.error('Lỗi khi yêu thích:', error);
      toast.error('Đã xảy ra lỗi khi thực hiện yêu thích. Vui lòng thử lại!');
    }
  };

  // Handle toggle comment section
  const handleToggleComment = () => {
    setOpenComment((prev) => !prev);
  };

  // Handle submit comment
  const handleComment = async () => {
    try {
      if (!comment.trim()) return;

      await createComment({
        eventId: event._id,
        text: comment,
      }).unwrap();

      setComment('');
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
      toast.error('Có lỗi xảy ra khi gửi bình luận');
    }
  };

  // Handle event registration
  const handleRegister = async () => {
    try {
      await registerEvent({ eventId: event._id }).unwrap();
      toast.success('Đăng ký sự kiện thành công');
    } catch (error: any) {
      if (error?.status === 400) {
        toast.info('Bạn đã đăng ký sự kiện này');
      } else {
        toast.error('Có lỗi xảy ra khi đăng ký');
      }
    }
  };

  return (
    <>
      <div className="shadow-[0_0_5px_black] w-[800px] p-[30px] rounded-lg bg-white mb-5">
        {/* Header */}
        <div className="flex justify-between mb-3">
          <div className="flex items-center">
            <img
              src={avatar}
              alt="avatar"
              className="rounded-full mr-2 w-10 aspect-square"
            />
            <div>
              <div className="font-bold text-[#073763]">
                {event.chapterId.name}
              </div>
            </div>
          </div>
          {event.status === 'pending' && (
            <div
              className="rounded-[10px] bg-[#3d85c6] text-white px-5 py-2.5 font-bold cursor-pointer active:opacity-70 active:-translate-y-0.5 transition-all"
              onClick={handleRegister}
            >
              Đăng ký
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-3">
          <div className="text-right text-[#999] text-base w-full mb-2.5">
            <p className="text-[#073763] text-2xl font-bold text-center">
              {event.name}
            </p>
            <p>{formatVietnamTime(event.startedAt)}</p>
          </div>

          <p className="text-justify">{event.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-row gap-2.5 mb-3">
          {event.tags.map((item: string) => (
            <div
              key={item}
              className="bg-[#3d85c6] text-white px-2 py-1 rounded-[10px]"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Images */}
        {event.images.length > 0 && (
          <div className="flex gap-2.5 h-[260px] overflow-auto p-2.5 mb-3">
            {event.images.map((item: { path: string }) => (
              <img
                key={item.path}
                src={item.path}
                alt={`image-${item.path}`}
                className="rounded-[10px] shadow-[0_0_3px_black]"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-start border-t border-[#ccc] pt-5 gap-5 mt-[30px]">
          <button
            className="bg-transparent border-none cursor-pointer flex items-center gap-2.5"
            onClick={handleLike}
          >
            {like ? (
              <Heart size={20} color="red" fill="red" />
            ) : (
              <Heart size={20} color="#000" fill="none" />
            )}
            <p>Yêu thích</p>
          </button>

          <button
            className="bg-transparent border-none cursor-pointer flex items-center gap-2.5"
            onClick={handleToggleComment}
          >
            <MessageCircle size={20} color="#073763" />
            <p>Bình luận</p>
          </button>
        </div>

        {/* Comment Section */}
        {openComment && (
          <div className="border-t border-[#ccc] pt-2">
            <div className="flex mb-2.5">
              <input
                type="text"
                placeholder="Viết bình luận..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                className="flex-1 p-1.5 rounded border border-[#ccc] outline-none caret-black"
              />
              <button
                onClick={handleComment}
                className="ml-2 px-3 py-1.5 rounded border-none bg-[#007bff] text-white cursor-pointer hover:bg-[#0056b3] transition-colors"
              >
                Gửi
              </button>
            </div>

            <div className="my-5 mx-2.5 max-h-[240px] overflow-auto bg-[#f0f8ff] outline-[10px] outline-[#f0f8ff] px-2.5 rounded-[5px]">
              {comments.map((item: Comment) => (
                <div key={item._id} className="my-5">
                  <div className="flex items-start gap-2.5">
                    <img
                      src={item.accountId?.avatar?.path || avatar}
                      alt="avatar"
                      className="rounded-full w-10 aspect-square"
                    />
                    <div className="bg-white p-2.5 rounded-[10px] flex flex-col gap-1.5">
                      <div className="font-bold">
                        {item.accountId?.fullname}
                      </div>
                      <p className="text-justify">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventCard;
