
import cloudinary from "../configs/cloudinary.js";
import Account from "../models/account.model.js";
import Document from "../models/document.model.js";
import { sendResponse } from "../utils/response.js";
import { validateDocumentForm } from "../utils/validate.js";

const DocumentController = () => {
  // Tạo mới tài liệu
  const createDocument = async (req, res) => {
    try {
          const form = req.body
    const file = req.file
    const chapterId = req.account.managerOf

    const validate = validateDocumentForm(form)
    if (validate) {
      return sendResponse(res, 400, validate)

    }

    const duplicate = await Document.findOne({ docCode: form.docCode })
    if (duplicate) {
      return sendResponse(res, 400, 'Văn bản này đã tồn tại')
    }
    const document = new Document(form)

    document.file = file
    document.chapterId = chapterId

    await document.save()

    return sendResponse(res, 200)
    } catch (error) {
       console.log(error)
    return sendResponse(res, 500, 'Có lỗi xảy ra khi tạo tài liệu')
    }

  };

const getDocumentsInPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const type = req.query.type;
    const scope = req.query.scope;
    const account = await Account.findById(req.account._id).populate('infoMember')
    const chapterId = account.managerOf || account.infoMember.memberOf

    const filter = {
      name: { $regex: search, $options: "i" },
    };

    if (type) filter.type = type;
    if (scope) filter.scope = scope;
      if (chapterId) filter.chapterId= chapterId;

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      lean: true, // trả về plain object thay vì Mongoose documents
    };

    const result = await Document.paginate(filter, options);

    return res.status(200).json({
      message: "Lấy danh sách tài liệu thành công",
      data: {
        documents: result.docs,
        totalDocuments: result.totalDocs,
        totalPages: result.totalPages,
        currentPage: result.page,
        limit: result.limit,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi lấy danh sách tài liệu",
    });
  }
};

const getDocumentById = async(req,res)=>{
  try {
    const {id} = req.params
    console.log(id)
    const document = await Document.findById(id)

    
   return sendResponse(res, 200, 'Lấy tài liệu',document)
    } catch (error) {
       console.log(error)
    return sendResponse(res, 500, 'Có lỗi xảy ra khi tạo tài liệu')
    }
}

const updateDocumentById = async (req, res) => {
  try {
    const form = req.body;
    const file = req.file;
    const { id } = req.params;

    // Lấy tài liệu cũ
    const oldDocument = await Document.findById(id);
    if (!oldDocument) {
      return sendResponse(res, 404, "Không tìm thấy tài liệu.");
    }

    // Kiểm tra validate form
    const validate = validateDocumentForm(form);
    if (validate) {
      return sendResponse(res, 400, validate);
    }

    // Kiểm tra trùng mã văn bản
    const duplicate = await Document.findOne({ docCode: form.docCode });
    if (duplicate && duplicate._id.toString() !== id) {
      return sendResponse(res, 400, "Văn bản này đã tồn tại");
    }

    // Tạo mới tài liệu với dữ liệu đã cập nhật
    const newDocument = new Document({
      ...form,
      file: file || oldDocument.file, // Nếu không upload file mới thì giữ file cũ
      chapterId: oldDocument.chapterId,
    });

    await newDocument.save();

    // Nếu có file mới thì xóa file cũ trên Cloudinary
    if (file && oldDocument.file?.filename) {
      await cloudinary.uploader.destroy(oldDocument.file.filename);
    }

    // Xóa bản ghi cũ trong MongoDB
    await Document.findByIdAndDelete(id);

    return sendResponse(res, 200, "Đã cập nhật văn bản bằng bản ghi mới", newDocument);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Có lỗi xảy ra khi cập nhật tài liệu");
  }
};





const getStatistic = async (req, res) => {
  try {
    const chapterId = req.account.managerOf;

    const documents = await Document.find({ chapterId });

    // Thống kê theo loại tài liệu (type)
    const typeCounts = {
      VBHC: 0,
      TLSH: 0,
      other: 0
    };

    // Thống kê theo phạm vi (scope)
    const scopeCounts = {
      chapter: 0,
      private: 0
    };

    documents.forEach((doc) => {
      if (doc.type && typeCounts.hasOwnProperty(doc.type)) {
        typeCounts[doc.type]++;
      }

      if (doc.scope && scopeCounts.hasOwnProperty(doc.scope)) {
        scopeCounts[doc.scope]++;
      }
    });

    const documentByType = Object.entries(typeCounts).map(([key, value]) => ({
      name: key,
      value
    }));

    const documentByScope = Object.entries(scopeCounts).map(([key, value]) => ({
      name: key,
      value
    }));

    return sendResponse(res, 200, "Thống kê tài liệu thành công", {
      documentByType,
      documentByScope
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Có lỗi xảy ra khi thống kê tài liệu");
  }
};




  return {
    createDocument,
    getDocumentsInPage,
    getDocumentById,
    updateDocumentById,
    // changeDocumentStatus,
    getStatistic
  };
};

export default DocumentController();
