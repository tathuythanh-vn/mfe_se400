import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useGetAccountByIdQuery,
  useUpdateAccountByIdMutation,
  useGetChaptersInPageQuery,
  type Chapter,
} from '../../../stores';
import AccountDetailForm from './AccountDetailForm';

interface AccountDetailsProps {
  id: string;
  open: (value: boolean) => void;
  profile?: boolean;
}

interface UpdateData {
  avatar?: File;
  [key: string]: string | File | undefined;
}

interface ChapterOption {
  value: string;
  name: string;
}

export default function AccountDetails({
  id,
  open,
  profile = false,
}: AccountDetailsProps) {
  // Only track changes/updates in local state
  const [updates, setUpdates] = useState<UpdateData>({});

  // Fetch account data
  const {
    data: accountResponse,
    isLoading,
    isError,
  } = useGetAccountByIdQuery(id, {
    skip: !id,
  });

  // Fetch chapter
  const { data: chaptersResponse } = useGetChaptersInPageQuery({
    page: 1,
    limit: 10000,
  });

  // Update account mutation
  const [updateAccount, { isLoading: isUpdating }] =
    useUpdateAccountByIdMutation();

  // Access data directly from RTK Query - no useEffect needed!
  const data = accountResponse?.data?.accounts?.[0] || accountResponse?.data;
  const chapters: ChapterOption[] =
    chaptersResponse?.data?.result?.map((item: Chapter) => ({
      value: item._id,
      name: item.name,
    })) || [];

  const handleUpdate = async () => {
    if (Object.keys(updates).length === 0) {
      toast.info('Không có thay đổi để lưu.');
      return;
    }

    try {
      const formData = new FormData();
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          const value = updates[key];
          if (value !== undefined) {
            formData.append(key, value);
          }
        }
      }

      await updateAccount({ id, formData }).unwrap();
      toast.success('Cập nhật thành công.');
      setUpdates({}); // Clear updates after success
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật thất bại.');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="w-4/5 bg-white rounded-[20px] py-12 px-8">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#36d7b7]" />
            <p className="text-gray-600 text-lg">
              Đang tải dữ liệu người dùng...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="w-4/5 bg-white rounded-[20px] py-12 px-8">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <X className="w-12 h-12 text-red-500" />
            <p className="text-gray-600 text-lg">
              Không thể tải dữ liệu người dùng
            </p>
            <button
              onClick={() => open(false)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-4/5 bg-white rounded-[20px] py-12 px-8 relative">
        <button
          className="absolute top-2.5 right-2.5 border-none bg-transparent cursor-pointer active:-translate-y-0.5"
          onClick={() => open(false)}
        >
          <X size={40} color="red" />
        </button>

        <AccountDetailForm
          data={data}
          updates={updates}
          chapters={chapters}
          profile={profile}
          isUpdating={isUpdating}
          setUpdates={setUpdates}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
