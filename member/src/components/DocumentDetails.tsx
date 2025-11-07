import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { X } from 'lucide-react';
// @ts-ignore - Module federation remote
import {
  useGetDocumentByIdQuery,
  useUpdateDocumentByIdMutation,
} from 'home/store';
import PdfDocument from './PdfDocument';

interface DocumentDetailsProps {
  id: string;
  open: (value: boolean) => void;
  canEdit: boolean;
}

export default function DocumentDetails({
  id,
  open,
  canEdit,
}: DocumentDetailsProps) {
  const [file, setFile] = useState<File | string | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    docCode: '',
    scope: '',
    type: 'VBHC',
    description: '',
  });

  // Use RTK Query to fetch document details
  const {
    data: documentResponse,
    isLoading,
    isError,
  } = useGetDocumentByIdQuery(id, {
    skip: !id,
  });

  // Use RTK Query mutation for updating document
  const [updateDocument, { isLoading: isUpdating }] =
    useUpdateDocumentByIdMutation();

  // Update form data when document is fetched
  useEffect(() => {
    if (documentResponse?.data) {
      const result = documentResponse.data;
      setFormData({
        name: result.name || '',
        docCode: result.docCode || '',
        scope: result.scope || '',
        type: result.type || 'VBHC',
        description: result.description || '',
      });
      if (result.file) {
        setFile(result.file.path);
      }
    }
  }, [documentResponse]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (isError) {
      toast.error('Không thể tải tài liệu');
    }
  }, [isError]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Vui lòng chọn một tệp PDF hợp lệ.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file PDF!');
      return;
    }

    try {
      const data = new FormData();
      if (file instanceof File) {
        data.append('file', file);
      }
      data.append('name', formData.name);
      data.append('docCode', formData.docCode);
      data.append('scope', formData.scope);
      data.append('type', formData.type);
      data.append('description', formData.description);

      await updateDocument({ id, formData: data }).unwrap();
      toast.success('Lưu tài liệu thành công!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Đã xảy ra lỗi!');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="absolute top-0 bg-black/50 w-full h-full flex justify-center items-center">
        <div className="w-4/5 bg-white rounded-[20px] py-[50px] px-[30px] box-border relative">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <ClipLoader color="#36d7b7" size={50} />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 bg-black/50 w-full h-full flex justify-center items-center">
      <div className="w-4/5 bg-white rounded-[20px] py-[50px] px-[30px] box-border relative">
        <button
          className="absolute top-2.5 right-2.5 border-none bg-transparent cursor-pointer active:-translate-y-0.5"
          onClick={() => open(false)}
        >
          <X size={40} color="red" />
        </button>

        <div className="overflow-auto max-h-[80vh] pr-5 flex gap-2.5 flex-col mb-5 justify-between">
          <div className="flex-1 flex flex-col justify-items-center items-center gap-5">
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="name" className="text-(--normal-blue) font-bold">
                Tên văn bản
              </label>
              <input
                id="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!canEdit}
                className="outline-none h-9 rounded-[10px] px-2.5 border border-solid border-(--normal-blue) caret-black text-(--normal-blue)"
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="docCode"
                className="text-(--normal-blue) font-bold"
              >
                Số hiệu
              </label>
              <input
                id="docCode"
                value={formData.docCode}
                onChange={handleChange}
                disabled={!canEdit}
                className="outline-none h-9 rounded-[10px] px-2.5 border border-solid border-(--normal-blue) caret-black text-(--normal-blue)"
              />
            </div>

            <div className="flex gap-5 items-space-between w-full">
              <div className="flex flex-col gap-1.5 w-full flex-2">
                <label
                  htmlFor="scope"
                  className="text-(--normal-blue) font-bold"
                >
                  Phạm vi
                </label>
                <select
                  id="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="outline-none h-9 rounded-[10px] px-2.5 border border-solid border-(--normal-blue) caret-black text-(--normal-blue)"
                >
                  <option value="private">Mật</option>
                  <option value="chapter">Nội bộ</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 w-full flex-3">
                <label
                  htmlFor="type"
                  className="text-(--normal-blue) font-bold"
                >
                  Loại tài liệu
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="outline-none h-9 rounded-[10px] px-2.5 border border-solid border-(--normal-blue) caret-black text-(--normal-blue)"
                >
                  <option value="VBHC">Văn bản hành chính</option>
                  <option value="TLSH">Tài liệu sinh hoạt</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="description"
                className="text-(--normal-blue) font-bold"
              >
                Mô tả
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={!canEdit}
                placeholder="Nhập mô tả"
                className="outline-none resize-none p-2.5 rounded-[10px] border border-solid border-(--normal-blue) text-(--normal-blue) caret-black"
              />
            </div>

            {canEdit && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUpdating}
                className="bg-(--normal-blue) text-white font-bold py-2 px-6 rounded-[10px] mt-5 text-center w-[100px] disabled:cursor-not-allowed cursor-pointer"
              >
                {isUpdating ? <ClipLoader size={16} color="#fff" /> : 'Lưu'}
              </button>
            )}
          </div>

          <div>
            <h2 className="text-(--dark-blue)">Xem tài liệu PDF</h2>

            {canEdit && (
              <label className="inline-block bg-(--normal-blue) text-white w-fit py-1.5 px-3 rounded-lg cursor-pointer font-medium transition-all hover:bg-(--weight-blue) mt-2.5">
                Chọn file PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {file && (
              <div className="mt-2.5 border-10 border-solid border-(--normal-blue) rounded-[10px] h-[500px] overflow-auto bg-(--normal-blue) pr-2.5">
                <PdfDocument file={file} width={400} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
