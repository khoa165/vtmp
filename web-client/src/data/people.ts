import { MentorshipPerson } from 'types';
import {
  CompanyName,
  MentorshipRole,
  OfferChannel,
  OfferType,
} from 'utils/constants';

export const mentorshipPeople: Record<string, MentorshipPerson> = {
  khoale: {
    name: 'Khoa Le',
    alias: 'khoale',
    trackingName: 'Khoa',
    hobbies: 'board games, chess, reality shows',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/q_100/v1577895922/portfolio/avatar.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer @ Vanta',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.PROGRAM_LEAD,
          MentorshipRole.MENTOR,
        ],
      },
      {
        year: 2024,
        title: 'Software Engineer II @ Vanta',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.PROGRAM_LEAD,
          MentorshipRole.MENTOR,
        ],
      },
      {
        year: 2025,
        title: 'Software Engineer II @ Vanta',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.PROGRAM_MANAGER,
          MentorshipRole.LEAD,
          MentorshipRole.MENTOR,
        ],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  huyanh: {
    name: 'Huy Anh',
    alias: 'huyanh',
    trackingName: 'Huy Anh',
    hobbies: 'cats, startups, capybara',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083192/viettech/huyanh.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer Intern @ Netflix',
        roles: [MentorshipRole.PROGRAM_FOUNDER, MentorshipRole.MENTOR],
      },
      {
        year: 2024,
        title: 'Software Engineer @ Netflix',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.LEAD,
          MentorshipRole.MENTOR,
        ],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Netflix',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.LEAD,
          MentorshipRole.MENTOR,
        ],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  chanle: {
    name: 'Chan Le',
    alias: 'chanle',
    trackingName: 'Chân',
    hobbies: 'real estate, real estate, real estate',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083254/viettech/chanle.jpg',
    terms: [
      {
        year: 2023,
        title: 'Viet Tech Founder',
        roles: [MentorshipRole.MENTOR],
      },
      {
        year: 2024,
        title: 'Viet Tech Founder',
        roles: [MentorshipRole.PROGRAM_ADVISOR],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  nguyenvu: {
    name: 'Nguyen Vu',
    alias: 'nguyenvu',
    trackingName: 'Nguyên',
    hobbies: 'hiking, nature, cooking',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083321/viettech/nguyen.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer Intern @ LinkedIn',
        roles: [MentorshipRole.MENTOR],
      },
      {
        year: 2024,
        title: 'Software Engineer @ Mastercard',
        roles: [MentorshipRole.LEAD, MentorshipRole.MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Mastercard',
        roles: [MentorshipRole.INACTIVE_LEAD],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  thuanh: {
    name: 'Thu Anh',
    alias: 'thuanh',
    trackingName: 'Thu Anh',
    hobbies: 'reading, writing, corgi',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083321/viettech/thuanh.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer @ Mastercard',
        roles: [MentorshipRole.MENTOR],
      },
      {
        year: 2024,
        title: 'Software Engineer II @ Mastercard',
        roles: [MentorshipRole.LEAD, MentorshipRole.MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer II @ Mastercard',
        roles: [MentorshipRole.LEAD, MentorshipRole.MENTOR],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  kevinluu: {
    name: 'Kevin Luu',
    alias: 'kevinluu',
    trackingName: 'Kevin',
    hobbies: 'travel, pickle ball, badminton',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083321/viettech/kevin.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer @ Gantry',
        roles: [MentorshipRole.MENTOR],
      },
      {
        year: 2024,
        title: 'Software Engineer @ Anyscale',
        roles: [MentorshipRole.LEAD, MentorshipRole.MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer II @ Anyscale',
        roles: [MentorshipRole.INACTIVE_LEAD],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  jennyquach: {
    name: 'Jenny Quach',
    alias: 'jennyquach',
    trackingName: 'Jenny',
    hobbies: 'board games, anime, food',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/jenny.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ UCSD',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.LINKEDIN,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-03-25',
          },
          {
            name: CompanyName.AMAZON,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-02-27',
          },
          {
            name: CompanyName.WAYFAIR,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-10-02',
          },
          {
            name: CompanyName.BNY_MELLON,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-09-29',
          },
        ],
        teamName: 'Productify',
        teamNumber: 3,
        teamRanking: 1,
        teammates: ['dangpham', 'robinhoang', 'phuocong'],
        mentors: ['kevinluu'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ LinkedIn + Amazon',
        roles: [MentorshipRole.LEAD, MentorshipRole.EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.AMAZON,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.RETURN_OFFER,
            date: '2025-03-01',
          },
          {
            name: CompanyName.LINKEDIN,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.RETURN_OFFER,
            date: '2024-11-08',
          },
        ],
      },
      {
        year: 2025,
        title: 'Software Engineer @ LinkedIn',
        roles: [MentorshipRole.PROGRAM_LEAD, MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  sonmac: {
    name: 'Son Mac',
    alias: 'sonmac',
    trackingName: 'Sơn',
    hobbies: 'frontend, cats, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083321/viettech/son.jpg',
    terms: [
      {
        year: 2024,
        title: 'Software Engineer @ Vanta',
        roles: [MentorshipRole.MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Vanta',
        roles: [MentorshipRole.MENTOR],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  nickdoan: {
    name: 'Nick Doan',
    alias: 'nickdoan',
    trackingName: 'Nick',
    hobbies: 'coding, running, games',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083513/viettech/nick.jpg',
    terms: [
      {
        year: 2024,
        title: 'Software Engineer @ Palantir',
        roles: [MentorshipRole.MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Palantir',
        roles: [MentorshipRole.MENTOR],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  sarahvo: {
    name: 'Sarah Vo',
    alias: 'sarahvo',
    trackingName: 'Sarah',
    hobbies: 'board games, PC games, cooking',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1738564970/viettech/sarah.jpg',
    terms: [
      {
        year: 2025,
        title: 'Software Engineer @ Amazon',
        roles: [MentorshipRole.MENTOR],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  dangpham: {
    name: 'Dang Pham',
    alias: 'dangpham',
    trackingName: 'Đăng',
    hobbies: 'reading, writing, gaming',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/dang.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ USF',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.SERVICE_NOW,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-01-18',
          },
          {
            name: CompanyName.LILLY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-11-07',
          },
        ],
        teamName: 'Productify',
        teamNumber: 3,
        teamRanking: 1,
        teammates: ['jennyquach', 'robinhoang', 'phuocong'],
        mentors: ['huyanh'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ ServiceNow',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.META,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-12-02',
          },
          {
            name: CompanyName.SERVICE_NOW,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.RETURN_OFFER,
            date: '2024-08-16',
          },
        ],
      },
    ],
  },
  robinhoang: {
    name: 'Robin Hoang',
    alias: 'robinhoang',
    trackingName: 'Robin',
    hobbies: 'solo trip, pole dance, beach',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/robin.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Colby',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.MONGODB,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-10-13',
          },
          {
            name: CompanyName.BANK_OF_AMERICA,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-10-11',
          },
          {
            name: CompanyName.MICROSOFT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-10-10',
          },
        ],
        teamName: 'Productify',
        teamNumber: 3,
        teamRanking: 1,
        teammates: ['dangpham', 'jennyquach', 'phuocong'],
        mentors: ['khoale', 'thuanh'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ Microsoft',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.MICROSOFT,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.RETURN_OFFER,
            date: '2024-08-29',
          },
        ],
      },
    ],
  },
  phuocong: {
    name: 'Phuoc Ong',
    alias: 'phuocong',
    trackingName: 'Phước',
    hobbies: 'gym, food, dog',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/phuoc.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ DePauw',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.NIANTIC,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-01-26',
          },
          {
            name: CompanyName.META,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-01-24',
          },
          {
            name: CompanyName.SERVICE_NOW,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-01-22',
          },
        ],
        teamName: 'Productify',
        teamNumber: 3,
        teamRanking: 1,
        teammates: ['dangpham', 'jennyquach', 'robinhoang'],
        mentors: ['nguyenvu'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ Meta',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.WAYMO,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-14',
          },
          {
            name: CompanyName.META,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.RETURN_OFFER,
            date: '2024-11-04',
          },
          {
            name: CompanyName.DOORDASH,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-17',
          },
          {
            name: CompanyName.PLAID,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-17',
          },
          {
            name: CompanyName.ROBINHOOD,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-09-29',
          },
          {
            name: CompanyName.MICROSOFT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-09-20',
          },
        ],
      },
    ],
  },
  khuetang: {
    name: 'Khue Tang',
    alias: 'khuetang',
    trackingName: 'Khuê',
    hobbies: 'pekking duck, cooking, hiking',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/khue.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Providence',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.LINKEDIN,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-10-12',
          },
          {
            name: CompanyName.PROOFPOINT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-10-04',
          },
        ],
        teamName: 'Safe travel',
        teamNumber: 2,
        teamRanking: 2,
        teammates: ['phuongcao', 'ngocdoan', 'cuongnguyen'],
        mentors: ['khoale'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ LinkedIn',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.LINKEDIN,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.RETURN_OFFER,
            date: '2024-10-28',
          },
        ],
      },
      {
        year: 2025,
        title: 'Software Engineer @ LinkedIn',
        roles: [MentorshipRole.EXMENTEE_INACTIVE_MENTOR],
      },
    ],
  },
  phuongcao: {
    name: 'Phuong Cao',
    alias: 'phuongcao',
    trackingName: 'Phương',
    hobbies: 'pekking duck, anime, music',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/minhphuong.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Bucknell',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.AMAZON,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-01-30',
          },
          {
            name: CompanyName.ADOBE,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-10-06',
          },
        ],
        teamName: 'Safe travel',
        teamNumber: 2,
        teamRanking: 2,
        teammates: ['khuetang', 'ngocdoan', 'cuongnguyen'],
        mentors: ['kevinluu'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ Adobe',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.BUBBLE_IO,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-22',
          },
          {
            name: CompanyName.MICROSOFT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-09-20',
          },
        ],
      },
    ],
  },
  ngocdoan: {
    name: 'Ngoc Doan',
    alias: 'ngocdoan',
    trackingName: 'Ngọc',
    hobbies: 'road trip, food, concert',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/placeholder.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Soka',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.DOORDASH,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-11-03',
          },
          {
            name: CompanyName.WAYFAIR,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-09-29',
          },
        ],
        teamName: 'Safe travel',
        teamNumber: 2,
        teamRanking: 2,
        teammates: ['khuetang', 'phuongcao', 'cuongnguyen'],
        mentors: ['nguyenvu'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ DoorDash',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.DOORDASH,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.RETURN_OFFER,
            date: '2024-09-25',
          },
        ],
      },
    ],
  },
  cuongnguyen: {
    name: 'Cuong Nguyen',
    alias: 'cuongnguyen',
    trackingName: 'Cường',
    hobbies: 'board games, PC games, anime',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/cuong.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Amherst',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.WAYFAIR,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.EXTERNAL,
            date: '2024-05-10',
          },
          {
            name: CompanyName.GODADDY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-12-01',
          },
        ],
        teamName: 'Safe travel',
        teamNumber: 2,
        teamRanking: 2,
        teammates: ['khuetang', 'phuongcao', 'ngocdoan'],
        mentors: ['khoale'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ GoDaddy',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.GOOGLE,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.EXTERNAL,
            date: '2025-01-14',
          },
          {
            name: CompanyName.BLOOMBERG,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.EXTERNAL,
            date: '2025-01-14',
          },
          {
            name: CompanyName.BUBBLE_IO,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-22',
          },
          {
            name: CompanyName.GODADDY,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.RETURN_OFFER,
            date: '2024-09-23',
          },
        ],
      },
    ],
  },
  quanle: {
    name: 'Quan Le',
    alias: 'quanle',
    trackingName: 'Minh Quân',
    hobbies: 'cosplay, board games, music',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/minhquan.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Cincinnati',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.META,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-02-27',
          },
          {
            name: CompanyName.SERVICE_NOW,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-02-27',
          },
          {
            name: CompanyName.MATSON_MONEY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-10-05',
          },
        ],
        teamName: 'Financial app',
        teamNumber: 1,
        teamRanking: 3,
        teammates: ['trangvu', 'hieuvuong', 'thanhnguyen'],
        mentors: ['chanle'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ Meta',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.META,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.RETURN_OFFER,
            date: '2024-08-22',
          },
        ],
      },
    ],
  },
  trangvu: {
    name: 'Trang Vu',
    alias: 'trangvu',
    trackingName: 'Trang Vũ',
    hobbies: 'board games, K-drama, flowers',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711084156/viettech/trangvu.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ York',
        roles: [MentorshipRole.MENTEE],
        teamName: 'Financial app',
        teamNumber: 1,
        teamRanking: 3,
        teammates: ['quanle', 'hieuvuong', 'thanhnguyen'],
        mentors: ['huyanh'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'Student @ York',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.SHOPIFY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-02-07',
          },
        ],
        teamName: 'Tourific',
        teamNumber: 7,
        teamRanking: 7,
        teammates: ['trihoang', 'vannguyen', 'khatran'],
        mentors: ['huyanh', 'khoale', 'vannguyen'],
        projectAdvisors: ['nickdoan', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Shopify',
        roles: [MentorshipRole.EXMENTEE_LOGISTICS_SUPPORT],
      },
    ],
  },
  hieuvuong: {
    name: 'Hieu Vuong',
    alias: 'hieuvuong',
    trackingName: 'Hiếu',
    hobbies: 'karaoke, beauty salon, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/hieu.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Victoria',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.SAP,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2023-11-08',
          },
        ],
        teamName: 'Financial app',
        teamNumber: 1,
        teamRanking: 3,
        teammates: ['quanle', 'trangvu', 'thanhnguyen'],
        mentors: ['nguyenvu', 'thuanh'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ SAP',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  thanhnguyen: {
    name: 'Thanh Nguyen',
    alias: 'thanhnguyen',
    trackingName: 'Thành',
    hobbies: 'beach, solo travel, writing',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711083621/viettech/thanh.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ UBC',
        roles: [MentorshipRole.MENTEE],
        teamName: 'Financial app',
        teamNumber: 1,
        teamRanking: 3,
        teammates: ['quanle', 'trangvu', 'hieuvuong'],
        mentors: ['khoale'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'Student @ UBC',
        roles: [MentorshipRole.MENTEE],
        teamName: 'Peace Pod',
        teamNumber: 6,
        teamRanking: 6,
        teammates: ['trangdo', 'haianh', 'namnguyen'],
        mentors: ['khoale'],
        projectAdvisors: ['khuetang', 'khoale'],
      },
    ],
  },
  hungngo: {
    name: 'Hung Ngo',
    alias: 'hungngo',
    trackingName: 'Hưng',
    hobbies: 'keyboard, music, League',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711685228/viettech/hung.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ UMass. Amherst',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.PLAYSTATION,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-02-19',
          },
        ],
        teamName: 'Flavorie',
        teamNumber: 1,
        teamRanking: 1,
        teammates: ['ngocanh', 'vynguyen', 'viennguyen'],
        mentors: ['nickdoan'],
        projectAdvisors: ['jennyquach', 'phuongcao', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ PlayStation',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  ngocanh: {
    name: 'Ngoc Anh',
    alias: 'ngocanh',
    trackingName: 'Ngọc Anh',
    hobbies: 'cooking, Chinese dramas, dogs',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711769961/viettech/ngocanh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Mount Holyoke',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.ROBINHOOD,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-01-16',
          },
          {
            name: CompanyName.GOLDMAN_SACHS,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-28',
          },
          {
            name: CompanyName.WAYFAIR,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-11',
          },
        ],
        teamName: 'Flavorie',
        teamNumber: 1,
        teamRanking: 1,
        teammates: ['hungngo', 'vynguyen', 'viennguyen'],
        mentors: ['khoale'],
        projectAdvisors: ['jennyquach', 'phuongcao', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Robinhood',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  vynguyen: {
    name: 'Vy Nguyen',
    alias: 'vynguyen',
    trackingName: 'Thuý Vy',
    hobbies: 'music, cooking, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711778695/viettech/vynguyen.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Catholic',
        roles: [MentorshipRole.MENTEE],
        teamName: 'Flavorie',
        teamNumber: 1,
        teamRanking: 1,
        teammates: ['hungngo', 'ngocanh', 'viennguyen'],
        mentors: ['jennyquach'],
        projectAdvisors: ['jennyquach', 'phuongcao', 'khoale'],
      },
    ],
  },
  viennguyen: {
    name: 'Vien Nguyen',
    alias: 'viennguyen',
    trackingName: 'Viên',
    hobbies: 'fencing, table tennis, travelling',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711819446/viettech/vien.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ USF',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.AMAZON,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-02-18',
          },
          {
            name: CompanyName.SERVICE_NOW,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-12-02',
          },
        ],
        teamName: 'Flavorie',
        teamNumber: 1,
        teamRanking: 1,
        teammates: ['hungngo', 'ngocanh', 'vynguyen'],
        mentors: ['sonmac'],
        projectAdvisors: ['jennyquach', 'phuongcao', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ ServiceNow',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  allyhoang: {
    name: 'Ally Hoang',
    alias: 'allyhoang',
    trackingName: 'Thục Anh',
    hobbies: 'cooking, embroidery, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711170325/viettech/thucanh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Lehigh',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.MICROSOFT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-12-16',
          },
          {
            name: CompanyName.PALANTIR,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-12-10',
          },
          {
            name: CompanyName.ADOBE,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-12-04',
          },
          {
            name: CompanyName.HUBSPOT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-07',
          },
          {
            name: CompanyName.HEROKU,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-08-07',
          },
        ],
        teamName: 'Pick Me Food',
        teamNumber: 2,
        teamRanking: 2,
        teammates: ['giangpham', 'phananh', 'quynguyen'],
        mentors: ['khoale', 'jennyquach'],
        projectAdvisors: ['sonmac', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Palantir',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  giangpham: {
    name: 'Giang Pham',
    alias: 'giangpham',
    trackingName: 'Giang',
    hobbies: 'Kpop, cooking, japanese books',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711262026/viettech/giang.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Colby',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.AMAZON,
            type: OfferType.NEW_GRAD,
            channel: OfferChannel.EXTERNAL,
            date: '2025-02-03',
          },
        ],
        teamName: 'Pick Me Food',
        teamNumber: 2,
        teamRanking: 2,
        teammates: ['allyhoang', 'phananh', 'quynguyen'],
        mentors: ['thuanh', 'robinhoang', 'khoale'],
        projectAdvisors: ['sonmac', 'khoale'],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Amazon',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  phananh: {
    name: 'Phan Anh',
    alias: 'phananh',
    trackingName: 'Phan Anh',
    hobbies: 'soccer, running, coding',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711815305/viettech/phananh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ DePauw',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.PAYPAL,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-29',
          },
          {
            name: CompanyName.ROBINHOOD,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-24',
          },
        ],
        teamName: 'Pick Me Food',
        teamNumber: 2,
        teamRanking: 2,
        teammates: ['allyhoang', 'giangpham', 'quynguyen'],
        mentors: ['khoale', 'khuetang'],
        projectAdvisors: ['sonmac', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Robinhood',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  quynguyen: {
    name: 'Quy Nguyen',
    alias: 'quynguyen',
    trackingName: 'Quý',
    hobbies: 'sports, soccer games, movies',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711341359/viettech/quy.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Windsor',
        roles: [MentorshipRole.MENTEE],
        teamName: 'Pick Me Food',
        teamNumber: 2,
        teamRanking: 2,
        teammates: ['allyhoang', 'giangpham', 'phananh'],
        mentors: ['cuongnguyen'],
        projectAdvisors: ['sonmac', 'khoale'],
      },
    ],
  },
  thangnguyen: {
    name: 'Thang Nguyen',
    alias: 'thangnguyen',
    trackingName: 'Thắng',
    hobbies: 'badminton, basketball, video game',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711261900/viettech/thang.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Toronto Metropolitan',
        roles: [MentorshipRole.MENTEE],
        teamName: 'Gathering Globe',
        teamNumber: 3,
        teamRanking: 3,
        teammates: ['quynhtran', 'phuongle', 'quannguyen'],
        mentors: ['kevinluu'],
        projectAdvisors: ['quanle', 'khoale'],
      },
    ],
  },
  quynhtran: {
    name: 'Quynh Tran',
    alias: 'quynhtran',
    trackingName: 'Quỳnh',
    hobbies: 'cats, K-pop, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711671347/viettech/quynh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ DePauw',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.KENCO_GROUP,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-11',
          },
          {
            name: CompanyName.BANK_OF_AMERICA,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-17',
          },
          {
            name: CompanyName.MICROSOFT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-16',
          },
          {
            name: CompanyName.MORGAN_STANLEY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-11',
          },
        ],
        teamName: 'Gathering Globe',
        teamNumber: 3,
        teamRanking: 3,
        teammates: ['thangnguyen', 'phuongle', 'quannguyen'],
        mentors: ['thuanh'],
        projectAdvisors: ['quanle', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Microsoft',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  phuongle: {
    name: 'Phuong Le',
    alias: 'phuongle',
    trackingName: 'Phượng',
    hobbies: 'films, novels, pop ballad',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711262168/viettech/phuongle.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Denison',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.QUALCOMM,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-12-03',
          },
          {
            name: CompanyName.WAYFAIR,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-11',
          },
        ],
        teamName: 'Gathering Globe',
        teamNumber: 3,
        teamRanking: 3,
        teammates: ['thangnguyen', 'quynhtran', 'quannguyen'],
        mentors: ['dangpham'],
        projectAdvisors: ['quanle', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Wayfair',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  quannguyen: {
    name: 'Quan Nguyen',
    alias: 'quannguyen',
    trackingName: 'Bá Quân',
    hobbies: 'guitar, photography, fishing',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711432601/viettech/baquan.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ USF',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.RYCO,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-02-20',
          },
        ],
        teamName: 'Gathering Globe',
        teamNumber: 3,
        teamRanking: 3,
        teammates: ['thangnguyen', 'quynhtran', 'phuongle'],
        mentors: ['phuocong'],
        projectAdvisors: ['quanle', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Ryco.io',
        roles: [MentorshipRole.EXMENTEE_LOGISTICS_SUPPORT],
      },
    ],
  },
  vytran: {
    name: 'Vy Tran',
    alias: 'vytran',
    trackingName: 'Vy Trần',
    hobbies: 'soccer, mountains, dogs',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711832950/viettech/vytran.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Bucknell',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.META,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-02-21',
          },
          {
            name: CompanyName.SENTRY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-02-04',
          },
          {
            name: CompanyName.MCDONALDS,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-19',
          },
        ],
        teamName: 'Bondscape',
        teamNumber: 4,
        teamRanking: 4,
        teammates: ['linhtran', 'jimmynguyen', 'longdau'],
        mentors: ['nguyenvu', 'khoale'],
        projectAdvisors: ['phuocong', 'khoale'],
      },
      {
        year: 2025,
        title: 'Data Engineer Intern @ Meta',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  linhtran: {
    name: 'Trang Linh',
    alias: 'linhtran',
    trackingName: 'Trang Linh',
    hobbies: 'draw, sleep, axolotl',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711839128/viettech/tranglinh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Hobart & William Smith',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.MICROSOFT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-06',
          },
          {
            name: CompanyName.VERISK,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-05',
          },
        ],
        teamName: 'Bondscape',
        teamNumber: 4,
        teamRanking: 4,
        teammates: ['vytran', 'jimmynguyen', 'longdau'],
        mentors: ['ngocdoan'],
        projectAdvisors: ['phuocong', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Microsoft',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  jimmynguyen: {
    name: 'Jimmy Nguyen',
    alias: 'jimmynguyen',
    trackingName: 'Phúc Khang',
    hobbies: 'ice-skating, MUN, skywatching',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711290737/viettech/phuckhang.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ York',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.SHOPIFY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-01-30',
          },
        ],
        teamName: 'Bondscape',
        teamNumber: 4,
        teamRanking: 4,
        teammates: ['vytran', 'linhtran', 'longdau'],
        mentors: ['phuongcao'],
        projectAdvisors: ['phuocong', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Shopify',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  longdau: {
    name: 'Long Dau',
    alias: 'longdau',
    trackingName: 'Long',
    hobbies: 'sports, video game, rap',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711170436/viettech/long.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Texas Christian',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.SERVICE_NOW,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-25',
          },
          {
            name: CompanyName.HELMERICH_PAYNE,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-10',
          },
        ],
        teamName: 'Bondscape',
        teamNumber: 4,
        teamRanking: 4,
        teammates: ['vytran', 'linhtran', 'jimmynguyen'],
        mentors: ['dangpham'],
        projectAdvisors: ['phuocong', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ ServiceNow',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  hoangnguyen: {
    name: 'Hoang Nguyen',
    alias: 'hoangnguyen',
    trackingName: 'Hoàng',
    hobbies: 'indie, k-drama, solo travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711129348/viettech/hoang.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Alberta',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.ROBINHOOD,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-25',
          },
          {
            name: CompanyName.SHOPIFY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-09-24',
          },
        ],
        teamName: 'Cupid',
        teamNumber: 5,
        teamRanking: 5,
        teammates: ['linhnguyen', 'linhhoang', 'khangnguyen'],
        mentors: ['hieuvuong'],
        projectAdvisors: ['dangpham', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Shopify + Robinhood',
        roles: [MentorshipRole.RISING_LEAD, MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  linhnguyen: {
    name: 'Linh Nguyen',
    alias: 'linhnguyen',
    trackingName: 'Hà Linh',
    hobbies: 'food, music, roller coaster',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711817532/viettech/linhnguyen.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Tufts',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.ADOBE,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-16',
          },
        ],
        teamName: 'Cupid',
        teamNumber: 5,
        teamRanking: 5,
        teammates: ['hoangnguyen', 'linhhoang', 'khangnguyen'],
        mentors: ['phuongcao'],
        projectAdvisors: ['dangpham', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Adobe',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  linhhoang: {
    name: 'Linh Hoang',
    alias: 'linhhoang',
    trackingName: 'Khánh Linh',
    hobbies: 'music, dumb tv shows, sunbathing',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711823122/viettech/khanhlinh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Dickinson',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.AMAZON,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-12-19',
          },
          {
            name: CompanyName.BANK_OF_AMERICA,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-17',
          },
          {
            name: CompanyName.MASTERCARD,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-09-26',
          },
        ],
        teamName: 'Cupid',
        teamNumber: 5,
        teamRanking: 5,
        teammates: ['hoangnguyen', 'linhnguyen', 'khangnguyen'],
        mentors: ['quanle'],
        projectAdvisors: ['dangpham', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Amazon',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  khangnguyen: {
    name: 'Khang Nguyen',
    alias: 'khangnguyen',
    trackingName: 'Hữu Khang',
    hobbies: 'J-pop, gaming, anime',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711089916/viettech/huukhang.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ UMass. Amherst',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.AMAZON,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-02-13',
          },
          {
            name: CompanyName.UKG,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-01-22',
          },
        ],
        teamName: 'Cupid',
        teamNumber: 5,
        teamRanking: 5,
        teammates: ['hoangnguyen', 'linhnguyen', 'linhhoang'],
        mentors: ['phuocong'],
        projectAdvisors: ['dangpham', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Amazon',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  trangdo: {
    name: 'Trang Do',
    alias: 'trangdo',
    trackingName: 'Trang Đỗ',
    hobbies: 'kdrama, cooking, Vpop',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711671186/viettech/trangdo.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Northeastern',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.ASANA,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-15',
          },
          {
            name: CompanyName.ORACLE,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-13',
          },
          {
            name: CompanyName.EBAY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-04',
          },
          {
            name: CompanyName.WAYFAIR,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-11',
          },
        ],
        teamName: 'Peace Pod',
        teamNumber: 6,
        teamRanking: 6,
        teammates: ['haianh', 'thanhnguyen', 'namnguyen'],
        mentors: ['nickdoan'],
        projectAdvisors: ['khuetang', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Asana',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  haianh: {
    name: 'Hai Anh',
    alias: 'haianh',
    trackingName: 'Hải Anh',
    hobbies: 'walking, bike riding, road trip',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711768766/viettech/haianh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Fordham',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.SLACK,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-08-12',
          },
        ],
        teamName: 'Peace Pod',
        teamNumber: 6,
        teamRanking: 6,
        teammates: ['trangdo', 'thanhnguyen', 'namnguyen'],
        mentors: ['khoale', 'robinhoang'],
        projectAdvisors: ['khuetang', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Slack',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  namnguyen: {
    name: 'Nam Nguyen',
    alias: 'namnguyen',
    trackingName: 'Nam',
    hobbies: 'soccer, One Piece, piano',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711261963/viettech/nam.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ MSU',
        roles: [MentorshipRole.MENTEE],
        teamName: 'Peace Pod',
        teamNumber: 6,
        teamRanking: 6,
        teammates: ['trangdo', 'haianh', 'thanhnguyen'],
        mentors: ['jennyquach'],
        projectAdvisors: ['khuetang', 'khoale'],
      },
    ],
  },
  trihoang: {
    name: 'Tri Hoang',
    alias: 'trihoang',
    trackingName: 'Trí',
    hobbies: 'sports, traveling, movies',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711131353/viettech/tri.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Rice',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.COINBASE,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-12-03',
          },
          {
            name: CompanyName.FOREFLIGHT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-12-03',
          },
          {
            name: CompanyName.EXPERIAN,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-13',
          },
          {
            name: CompanyName.META,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-03',
          },
          {
            name: CompanyName.PAYPAL,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-25',
          },
        ],
        teamName: 'Tourific',
        teamNumber: 7,
        teamRanking: 7,
        teammates: ['trangvu', 'vannguyen', 'khatran'],
        mentors: ['huyanh'],
        projectAdvisors: ['nickdoan', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Meta',
        roles: [MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  vannguyen: {
    name: 'Van Nguyen',
    alias: 'vannguyen',
    trackingName: 'Vân',
    hobbies: 'kdrama, tarot, drums',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711420611/viettech/van.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Soka',
        roles: [MentorshipRole.MENTEE],
        offers: [
          {
            name: CompanyName.ROBINHOOD,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-02-04',
          },
          {
            name: CompanyName.META,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-01-07',
          },
          {
            name: CompanyName.ADOBE,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-27',
          },
          {
            name: CompanyName.MICROSOFT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-13',
          },
          {
            name: CompanyName.EXPEDIA,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-12',
          },
          {
            name: CompanyName.GOLDMAN_SACHS,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-07',
          },
          {
            name: CompanyName.HUBSPOT,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-11-05',
          },
          {
            name: CompanyName.GRAMMARLY,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-18',
          },
          {
            name: CompanyName.BANK_OF_AMERICA,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-10-17',
          },
          {
            name: CompanyName.LIBERTY_MUTUAL_INSURANCE,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2024-09-19',
          },
        ],
        teamName: 'Tourific',
        teamNumber: 7,
        teamRanking: 7,
        teammates: ['trihoang', 'trangvu', 'khatran'],
        mentors: ['sonmac'],
        projectAdvisors: ['nickdoan', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Microsoft',
        roles: [MentorshipRole.RISING_LEAD, MentorshipRole.EXMENTEE_MENTOR],
      },
    ],
  },
  khatran: {
    name: 'Kha Tran',
    alias: 'khatran',
    trackingName: 'Kha',
    hobbies: 'coding, reading, gaming',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1711823667/viettech/kha.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Manitoba',
        roles: [MentorshipRole.MENTEE],
        teamName: 'Tourific',
        teamNumber: 7,
        teamRanking: 7,
        teammates: ['trihoang', 'trangvu', 'vannguyen'],
        mentors: ['khuetang'],
        projectAdvisors: ['nickdoan', 'khoale'],
      },
    ],
  },
};
