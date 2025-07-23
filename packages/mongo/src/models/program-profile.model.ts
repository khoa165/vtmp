import mongoose, { Document, Schema, Types } from 'mongoose';

enum PeopleName {
  AN_TRAN = 'AN_TRAN',
  BA_QUAN = 'BA_QUAN',
  CHAN_LE = 'CHAN_LE',
  CHAU_TRAN = 'CHAU_TRAN',
  CUONG_NGUYEN = 'CUONG_NGUYEN',
  DANG_SON = 'DANG_SON',
  DAN_NGUYEN = 'DAN_NGUYEN',
  DAT_VU = 'DAT_VU',
  DIEP_NGUYEN = 'DIEP_NGUYEN',
  DUC_NGUYEN = 'DUC_NGUYEN',
  GIANG_PHAM = 'GIANG_PHAM',
  HAI_ANH = 'HAI_ANH',
  HA_LINH = 'HA_LINH',
  HA_NGUYEN = 'HA_NGUYEN',
  HIEU_VUONG = 'HIEU_VUONG',
  HOANG_NGUYEN = 'HOANG_NGUYEN',
  HUE_QUAN = 'HUE_QUAN',
  HUNG_NGO = 'HUNG_NGO',
  HUU_DANG = 'HUU_DANG',
  HUU_KHANG = 'HUU_KHANG',
  HUY_ANH = 'HUY_ANH',
  JENNY_QUACH = 'JENNY_QUACH',
  KEVIN_DOAN = 'KEVIN_DOAN',
  KEVIN_LUU = 'KEVIN_LUU',
  KHANH_LINH = 'KHANH_LINH',
  KHA_TRAN = 'KHA_TRAN',
  KHOA_LE = 'KHOA_LE',
  KHUE_TANG = 'KHUE_TANG',
  KIEN_TRAN = 'KIEN_TRAN',
  LONG_DAU = 'LONG_DAU',
  MINH_QUAN = 'MINH_QUAN',
  MONICA_HUYNH = 'MONICA_HUYNH',
  NAM_NGUYEN = 'NAM_NGUYEN',
  NGOC_ANH_HOANG = 'NGOC_ANH_HOANG',
  NGOC_ANH_TRAN = 'NGOC_ANH_TRAN',
  NGOC_DOAN = 'NGOC_DOAN',
  NGOC_LINH = 'NGOC_LINH',
  NGOC_MINH = 'NGOC_MINH',
  NGUYEN_VU = 'NGUYEN_VU',
  NHAT_LE = 'NHAT_LE',
  NICK_DOAN = 'NICK_DOAN',
  PHAN_ANH = 'PHAN_ANH',
  PHUC_KHANG = 'PHUC_KHANG',
  PHUC_TRUONG = 'PHUC_TRUONG',
  PHUOC_ONG = 'PHUOC_ONG',
  PHUONG_CAO = 'PHUONG_CAO',
  PHUONG_LE = 'PHUONG_LE',
  QUANG_MINH = 'QUANG_MINH',
  QUYEN_DOAN = 'QUYEN_DOAN',
  QUYNH_TRAN = 'QUYNH_TRAN',
  QUY_NGUYEN = 'QUY_NGUYEN',
  ROBIN_HOANG = 'ROBIN_HOANG',
  SARAH_VO = 'SARAH_VO',
  TAM_DANG = 'TAM_DANG',
  TAM_NGUYEN = 'TAM_NGUYEN',
  THAI_DANG = 'THAI_DANG',
  THANG_NGUYEN = 'THANG_NGUYEN',
  THANH_NGUYEN = 'THANH_NGUYEN',
  THIEN_SON = 'THIEN_SON',
  THUC_ANH = 'THUC_ANH',
  THUY_LINH = 'THUY_LINH',
  THU_ANH = 'THU_ANH',
  TRANG_DO = 'TRANG_DO',
  TRANG_LINH = 'TRANG_LINH',
  TRANG_VU = 'TRANG_VU',
  TRAN_VO = 'TRAN_VO',
  TRI_HOANG = 'TRI_HOANG',
  TRI_NGUYEN = 'TRI_NGUYEN',
  TUAN_ANH = 'TUAN_ANH',
  UYEN_HOANG = 'UYEN_HOANG',
  VAN_NGUYEN = 'VAN_NGUYEN',
  VIEN_NGUYEN = 'VIEN_NGUYEN',
  VY_NGUYEN = 'VY_NGUYEN',
  VY_TRAN = 'VY_TRAN',
  XUAN_ANH = 'XUAN_ANH',
}

interface IProgramProfile extends Document {
  trackingKey: PeopleName;
  programName: string;
  userId: Types.ObjectId;
  yearJoined: number;
  isActive: boolean;
  hobbies: string[];
  school?: string;
  linkedin?: string;
  currentProfessionalTitle: string;
  isFounder: boolean;
  wasMentee: boolean;
  wasExternallyRecruitedMentor: boolean;

  // temporary field
  spreadsheetAlias: string;
}

const ProgramProfileSchema = new mongoose.Schema<IProgramProfile>(
  {
    trackingKey: {
      type: String,
      enum: Object.values(PeopleName),
      required: true,
    },
    programName: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    yearJoined: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    hobbies: {
      type: [String],
      default: [],
    },
    school: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    currentProfessionalTitle: {
      type: String,
      required: true,
    },
    isFounder: {
      type: Boolean,
      required: true,
    },
    wasMentee: {
      type: Boolean,
      required: true,
    },
    wasExternallyRecruitedMentor: {
      type: Boolean,
      required: true,
    },

    // temporary field
    spreadsheetAlias: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ProgramProfileModel = mongoose.model<IProgramProfile>(
  'ProgramProfile',
  ProgramProfileSchema
);
