// Backend response structure from sendResponse utility
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Document file structure (matches backend file object)
export interface DocumentFile {
  path: string;
  filename: string;
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  size?: number;
}

// Document model (matches backend Document schema)
export interface Document {
  _id: string;
  chapterId: string | null;
  docCode: string | null;
  name: string | null;
  type: 'VBHC' | 'TLSH' | 'other' | null;
  scope: 'chapter' | 'private' | null;
  description: string | null;
  file: DocumentFile | null;
  createdAt: string;
  updatedAt: string;
}

// Query parameters for getDocumentsInPage
export interface GetDocumentsInPageParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'VBHC' | 'TLSH' | 'other';
  scope?: 'private' | 'chapter';
}

// Response structure for paginated documents
export interface DocumentsPageData {
  documents: Document[];
  totalDocuments: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface GetDocumentsInPageResponse {
  message: string;
  data: DocumentsPageData;
}

// Response for getDocumentById
export type GetDocumentByIdResponse = ApiResponse<Document>;

// Response for createDocument (returns success/message only based on controller)
export type CreateDocumentResponse = ApiResponse<null>;

// Response for updateDocumentById
export type UpdateDocumentByIdResponse = ApiResponse<Document>;

// Document statistics structure
export interface DocumentStatistic {
  name: string;
  value: number;
}

export interface DocumentStatisticData {
  documentByType: DocumentStatistic[];
  documentByScope: DocumentStatistic[];
}

export type GetStatisticResponse = ApiResponse<DocumentStatisticData>;
