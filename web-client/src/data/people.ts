import { MentorshipPerson } from 'src/types';
import {
  CompanyName,
  MentorshipRole,
  OfferChannel,
  OfferType,
} from '@common/enums';

export const mentorshipPeople: Record<string, MentorshipPerson> = {
  khoale: {
    name: 'Khoa Le',
    firstLast: 'Khoa Le',
    alias: 'khoale',
    trackingName: 'Khoa',
    hobbies: 'board games, chess, reality shows',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/khoale.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer @ Vanta',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.PROGRAM_LEAD,
          MentorshipRole.SWE_PROGRAM_LEAD,
          MentorshipRole.SWE_MENTOR,
        ],
      },
      {
        year: 2024,
        title: 'Software Engineer II @ Vanta',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.PROGRAM_LEAD,
          MentorshipRole.SWE_PROGRAM_LEAD,
          MentorshipRole.SWE_MENTOR,
        ],
      },
      {
        year: 2025,
        title: 'Software Engineer II @ Vanta',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.PROGRAM_LEAD,
          MentorshipRole.SWE_LEAD,
          MentorshipRole.SWE_MENTOR,
        ],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  huyanh: {
    name: 'Huy Anh',
    firstLast: 'Anh Nguyen',
    alias: 'huyanh',
    trackingName: 'Huy Anh',
    hobbies: 'cats, startups, capybara',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/huyanh.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer Intern @ Netflix',
        roles: [MentorshipRole.PROGRAM_FOUNDER, MentorshipRole.SWE_MENTOR],
      },
      {
        year: 2024,
        title: 'Software Engineer @ Netflix',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.SWE_LEAD,
          MentorshipRole.SWE_MENTOR,
        ],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Netflix',
        roles: [
          MentorshipRole.PROGRAM_FOUNDER,
          MentorshipRole.SWE_LEAD,
          MentorshipRole.SWE_MENTOR,
        ],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  chanle: {
    name: 'Chan Le',
    firstLast: 'Chan Le',
    alias: 'chanle',
    trackingName: 'Chân',
    hobbies: 'real estate, real estate, real estate',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/chanle.jpg',
    terms: [
      {
        year: 2023,
        title: 'Viet Tech Founder',
        roles: [MentorshipRole.SWE_MENTOR],
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
    firstLast: 'Nguyen Vu',
    alias: 'nguyenvu',
    trackingName: 'Nguyên',
    hobbies: 'hiking, nature, cooking',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/nguyenvu.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer Intern @ LinkedIn',
        roles: [MentorshipRole.SWE_MENTOR],
      },
      {
        year: 2024,
        title: 'Software Engineer @ Mastercard',
        roles: [MentorshipRole.SWE_LEAD, MentorshipRole.SWE_MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Mastercard',
        roles: [MentorshipRole.SWE_INACTIVE_LEAD],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  thuanh: {
    name: 'Thu Anh',
    firstLast: 'Anh Pham',
    alias: 'thuanh',
    trackingName: 'Thu Anh',
    hobbies: 'reading, writing, corgi',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/thuanh.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer @ Mastercard',
        roles: [MentorshipRole.SWE_MENTOR],
      },
      {
        year: 2024,
        title: 'Software Engineer II @ Mastercard',
        roles: [MentorshipRole.SWE_LEAD, MentorshipRole.SWE_MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer II @ Mastercard',
        roles: [MentorshipRole.SWE_LEAD, MentorshipRole.SWE_MENTOR],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  kevinluu: {
    name: 'Kevin Luu',
    firstLast: 'Kevin Luu',
    alias: 'kevinluu',
    trackingName: 'Kevin',
    hobbies: 'travel, pickle ball, badminton',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/kevinluu.jpg',
    terms: [
      {
        year: 2023,
        title: 'Software Engineer @ Gantry',
        roles: [MentorshipRole.SWE_MENTOR],
      },
      {
        year: 2024,
        title: 'Software Engineer @ Anyscale',
        roles: [MentorshipRole.SWE_LEAD, MentorshipRole.SWE_MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer II @ Anyscale',
        roles: [MentorshipRole.SWE_INACTIVE_LEAD],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  jennyquach: {
    name: 'Jenny Quach',
    firstLast: 'Jenny Quach',
    alias: 'jennyquach',
    trackingName: 'Jenny',
    hobbies: 'board games, anime, food',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/jennyquach.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ UCSD',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['huudang', 'robinhoang', 'phuocong'],
        mentors: ['kevinluu'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ LinkedIn + Amazon',
        roles: [MentorshipRole.SWE_LEAD, MentorshipRole.SWE_EXMENTEE_MENTOR],
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
        roles: [
          MentorshipRole.SWE_PROGRAM_LEAD,
          MentorshipRole.SWE_EXMENTEE_MENTOR,
        ],
      },
    ],
  },
  thienson: {
    name: 'Thien Son',
    firstLast: 'Son Mac',
    alias: 'thienson',
    trackingName: 'Thiên Sơn',
    hobbies: 'frontend, cats, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/thienson.jpg',
    terms: [
      {
        year: 2024,
        title: 'Software Engineer @ Vanta',
        roles: [MentorshipRole.SWE_MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Vanta',
        roles: [MentorshipRole.SWE_MENTOR],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  nickdoan: {
    name: 'Nick Doan',
    firstLast: 'Nick Doan',
    alias: 'nickdoan',
    trackingName: 'Nick',
    hobbies: 'coding, running, games',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/nickdoan.jpg',
    terms: [
      {
        year: 2024,
        title: 'Software Engineer @ Palantir',
        roles: [MentorshipRole.SWE_MENTOR],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Palantir',
        roles: [MentorshipRole.SWE_MENTOR],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  sarahvo: {
    name: 'Sarah Vo',
    firstLast: 'Sarah Vo',
    alias: 'sarahvo',
    trackingName: 'Sarah',
    hobbies: 'board games, PC games, cooking',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/sarahvo.jpg',
    terms: [
      {
        year: 2025,
        title: 'Software Engineer @ Amazon',
        roles: [MentorshipRole.SWE_MENTOR],
      },
    ],
    hasNeverBeenMenteeOfProgram: true,
  },
  huudang: {
    name: 'Huu Dang',
    firstLast: 'Dang Pham',
    alias: 'huudang',
    trackingName: 'Đăng',
    hobbies: 'reading, writing, gaming',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/huudang.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ USF',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
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
    firstLast: 'Robin Hoang',
    alias: 'robinhoang',
    trackingName: 'Robin',
    hobbies: 'solo trip, pole dance, beach',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/robinhoang.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Colby',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['huudang', 'jennyquach', 'phuocong'],
        mentors: ['khoale', 'thuanh'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ Microsoft',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
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
    firstLast: 'Phuoc Ong',
    alias: 'phuocong',
    trackingName: 'Phước',
    hobbies: 'gym, food, dog',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/phuocong.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ DePauw',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['huudang', 'jennyquach', 'robinhoang'],
        mentors: ['nguyenvu'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ Meta',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
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
    firstLast: 'Khue Tang',
    alias: 'khuetang',
    trackingName: 'Khuê',
    hobbies: 'pekking duck, cooking, hiking',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/khuetang.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Providence',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
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
        roles: [MentorshipRole.SWE_EXMENTEE_INACTIVE_MENTOR],
      },
    ],
  },
  phuongcao: {
    name: 'Phuong Cao',
    firstLast: 'Phuong Cao',
    alias: 'phuongcao',
    trackingName: 'Phương',
    hobbies: 'pekking duck, anime, music',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/phuongcao.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Bucknell',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
        offers: [
          {
            name: CompanyName.NVIDIA,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-03-14',
          },
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
    firstLast: 'Ngoc Doan',
    alias: 'ngocdoan',
    trackingName: 'Ngọc',
    hobbies: 'road trip, food, concert',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/placeholder.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Soka',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
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
    firstLast: 'Cuong Nguyen',
    alias: 'cuongnguyen',
    trackingName: 'Cường',
    hobbies: 'board games, PC games, anime',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/cuongnguyen.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Amherst',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
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
  minhquan: {
    name: 'Minh Quan',
    firstLast: 'Quan Le',
    alias: 'minhquan',
    trackingName: 'Minh Quân',
    hobbies: 'cosplay, board games, music',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/minhquan.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Cincinnati',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
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
    name: 'Thuy Trang',
    firstLast: 'Trang Vu',
    alias: 'trangvu',
    trackingName: 'Trang Vũ',
    hobbies: 'board games, K-drama, flowers',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/trangvu.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ York',
        roles: [MentorshipRole.SWE_MENTEE],
        teamName: 'Financial app',
        teamNumber: 1,
        teamRanking: 3,
        teammates: ['minhquan', 'hieuvuong', 'thanhnguyen'],
        mentors: ['huyanh'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'Student @ York',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_LOGISTICS_SUPPORT],
      },
    ],
  },
  hieuvuong: {
    name: 'Hieu Vuong',
    firstLast: 'Hieu Vuong',
    alias: 'hieuvuong',
    trackingName: 'Hiếu',
    hobbies: 'karaoke, beauty salon, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/hieuvuong.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ Victoria',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['minhquan', 'trangvu', 'thanhnguyen'],
        mentors: ['nguyenvu', 'thuanh'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'SWE Intern @ SAP',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  thanhnguyen: {
    name: 'Thanh Nguyen',
    firstLast: 'Thanh Nguyen',
    alias: 'thanhnguyen',
    trackingName: 'Thành',
    hobbies: 'beach, solo travel, writing',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/thanhnguyen.jpg',
    terms: [
      {
        year: 2023,
        title: 'Student @ UBC',
        roles: [MentorshipRole.SWE_MENTEE],
        teamName: 'Financial app',
        teamNumber: 1,
        teamRanking: 3,
        teammates: ['minhquan', 'trangvu', 'hieuvuong'],
        mentors: ['khoale'],
        projectAdvisors: ['khoale'],
      },
      {
        year: 2024,
        title: 'Student @ UBC',
        roles: [MentorshipRole.SWE_MENTEE],
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
    firstLast: 'Hung Ngo',
    alias: 'hungngo',
    trackingName: 'Hưng',
    hobbies: 'keyboard, music, League',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/hungngo.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ UMass. Amherst',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['ngocanhtran', 'vynguyen', 'viennguyen'],
        mentors: ['nickdoan'],
        projectAdvisors: ['jennyquach', 'phuongcao', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ PlayStation',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  ngocanhtran: {
    name: 'Ngoc Anh Tran',
    firstLast: 'Anh Tran',
    alias: 'ngocanhtran',
    trackingName: 'Ngọc Anh',
    hobbies: 'cooking, Chinese dramas, dogs',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/ngocanhtran.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Mount Holyoke',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  vynguyen: {
    name: 'Vy Nguyen',
    firstLast: 'Vy Nguyen',
    alias: 'vynguyen',
    trackingName: 'Thuý Vy',
    hobbies: 'music, cooking, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/vynguyen.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Catholic',
        roles: [MentorshipRole.SWE_MENTEE],
        teamName: 'Flavorie',
        teamNumber: 1,
        teamRanking: 1,
        teammates: ['hungngo', 'ngocanhtran', 'viennguyen'],
        mentors: ['jennyquach'],
        projectAdvisors: ['jennyquach', 'phuongcao', 'khoale'],
      },
    ],
  },
  viennguyen: {
    name: 'Vien Nguyen',
    firstLast: 'Vien Nguyen',
    alias: 'viennguyen',
    trackingName: 'Viên',
    hobbies: 'fencing, table tennis, travelling',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/viennguyen.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ USF',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['hungngo', 'ngocanhtran', 'vynguyen'],
        mentors: ['thienson'],
        projectAdvisors: ['jennyquach', 'phuongcao', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ ServiceNow',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  thucanh: {
    name: 'Thuc Anh',
    firstLast: 'Anh Hoang',
    alias: 'thucanh',
    trackingName: 'Thục Anh',
    hobbies: 'cooking, embroidery, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/thucanh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Lehigh',
        roles: [MentorshipRole.SWE_MENTEE],
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
        projectAdvisors: ['thienson', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Palantir',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  giangpham: {
    name: 'Giang Pham',
    firstLast: 'Giang Pham',
    alias: 'giangpham',
    trackingName: 'Giang',
    hobbies: 'Kpop, cooking, japanese books',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/giangpham.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Colby',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['thucanh', 'phananh', 'quynguyen'],
        mentors: ['thuanh', 'robinhoang', 'khoale'],
        projectAdvisors: ['thienson', 'khoale'],
      },
      {
        year: 2025,
        title: 'Software Engineer @ Amazon',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  phananh: {
    name: 'Phan Anh',
    firstLast: 'Anh Nguyen',
    alias: 'phananh',
    trackingName: 'Phan Anh',
    hobbies: 'soccer, running, coding',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/phananh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ DePauw',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['thucanh', 'giangpham', 'quynguyen'],
        mentors: ['khoale', 'khuetang'],
        projectAdvisors: ['thienson', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Robinhood',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  quynguyen: {
    name: 'Quy Nguyen',
    firstLast: 'Quy Nguyen',
    alias: 'quynguyen',
    trackingName: 'Quý',
    hobbies: 'sports, soccer games, movies',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/quynguyen.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Windsor',
        roles: [MentorshipRole.SWE_MENTEE],
        teamName: 'Pick Me Food',
        teamNumber: 2,
        teamRanking: 2,
        teammates: ['thucanh', 'giangpham', 'phananh'],
        mentors: ['cuongnguyen'],
        projectAdvisors: ['thienson', 'khoale'],
      },
    ],
  },
  thangnguyen: {
    name: 'Thang Nguyen',
    firstLast: 'Thang Nguyen',
    alias: 'thangnguyen',
    trackingName: 'Thắng',
    hobbies: 'badminton, basketball, video game',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/thangnguyen.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Toronto Metropolitan',
        roles: [MentorshipRole.SWE_MENTEE],
        teamName: 'Gathering Globe',
        teamNumber: 3,
        teamRanking: 3,
        teammates: ['quynhtran', 'phuongle', 'baquan'],
        mentors: ['kevinluu'],
        projectAdvisors: ['minhquan', 'khoale'],
      },
    ],
  },
  quynhtran: {
    name: 'Quynh Tran',
    firstLast: 'Quynh Tran',
    alias: 'quynhtran',
    trackingName: 'Quỳnh',
    hobbies: 'cats, K-pop, travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/quynhtran.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ DePauw',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['thangnguyen', 'phuongle', 'baquan'],
        mentors: ['thuanh'],
        projectAdvisors: ['minhquan', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Microsoft',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  phuongle: {
    name: 'Phuong Le',
    firstLast: 'Phuong Le',
    alias: 'phuongle',
    trackingName: 'Phượng',
    hobbies: 'films, novels, pop ballad',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/phuongle.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Denison',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['thangnguyen', 'quynhtran', 'baquan'],
        mentors: ['huudang'],
        projectAdvisors: ['minhquan', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ TBD',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  baquan: {
    name: 'Ba Quan',
    firstLast: 'Quan Nguyen',
    alias: 'baquan',
    trackingName: 'Bá Quân',
    hobbies: 'guitar, photography, fishing',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/baquan.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ USF',
        roles: [MentorshipRole.SWE_MENTEE],
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
        projectAdvisors: ['minhquan', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Ryco.io',
        roles: [MentorshipRole.SWE_EXMENTEE_LOGISTICS_SUPPORT],
      },
    ],
  },
  vytran: {
    name: 'Vy Tran',
    firstLast: 'Vy Tran',
    alias: 'vytran',
    trackingName: 'Vy Trần',
    hobbies: 'soccer, mountains, dogs',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/vytran.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Bucknell',
        roles: [MentorshipRole.SWE_MENTEE],
        offers: [
          {
            name: CompanyName.WAYFAIR,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-03-12',
          },
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
        teammates: ['tranglinh', 'phuckhang', 'longdau'],
        mentors: ['nguyenvu', 'khoale'],
        projectAdvisors: ['phuocong', 'khoale'],
      },
      {
        year: 2025,
        title: 'Data Engineer Intern @ Meta',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  tranglinh: {
    name: 'Trang Linh',
    firstLast: 'Linh Tran',
    alias: 'tranglinh',
    trackingName: 'Trang Linh',
    hobbies: 'draw, sleep, axolotl',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/tranglinh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Hobart & William Smith',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['vytran', 'phuckhang', 'longdau'],
        mentors: ['ngocdoan'],
        projectAdvisors: ['phuocong', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Microsoft',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  phuckhang: {
    name: 'Phuc Khang',
    firstLast: 'Khang Nguyen',
    alias: 'phuckhang',
    trackingName: 'Phúc Khang',
    hobbies: 'ice-skating, MUN, skywatching',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/phuckhang.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ York',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['vytran', 'tranglinh', 'longdau'],
        mentors: ['phuongcao'],
        projectAdvisors: ['phuocong', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Shopify',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  longdau: {
    name: 'Long Dau',
    firstLast: 'Long Dau',
    alias: 'longdau',
    trackingName: 'Long',
    hobbies: 'sports, video game, rap',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/longdau.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ TCU',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['vytran', 'tranglinh', 'phuckhang'],
        mentors: ['huudang'],
        projectAdvisors: ['phuocong', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ ServiceNow',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  hoangnguyen: {
    name: 'Hoang Nguyen',
    firstLast: 'Hoang Nguyen',
    alias: 'hoangnguyen',
    trackingName: 'Hoàng',
    hobbies: 'indie, k-drama, solo travel',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/hoangnguyen.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Alberta',
        roles: [MentorshipRole.SWE_MENTEE],
        offers: [
          {
            name: CompanyName.AMAZON,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-03-21',
          },
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
        teammates: ['halinh', 'khanhlinh', 'huukhang'],
        mentors: ['hieuvuong'],
        projectAdvisors: ['huudang', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Shopify + Robinhood',
        roles: [
          MentorshipRole.SWE_RISING_LEAD,
          MentorshipRole.SWE_EXMENTEE_MENTOR,
        ],
      },
    ],
  },
  halinh: {
    name: 'Ha Linh',
    firstLast: 'Linh Nguyen',
    alias: 'halinh',
    trackingName: 'Hà Linh',
    hobbies: 'food, music, roller coaster',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/halinh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Tufts',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['hoangnguyen', 'khanhlinh', 'huukhang'],
        mentors: ['phuongcao'],
        projectAdvisors: ['huudang', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Adobe',
        roles: [
          MentorshipRole.SWE_RISING_LEAD,
          MentorshipRole.SWE_EXMENTEE_MENTOR,
        ],
      },
    ],
  },
  khanhlinh: {
    name: 'Khanh Linh',
    firstLast: 'Linh Hoang',
    alias: 'khanhlinh',
    trackingName: 'Khánh Linh',
    hobbies: 'music, dumb tv shows, sunbathing',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/khanhlinh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Dickinson',
        roles: [MentorshipRole.SWE_MENTEE],
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
        teammates: ['hoangnguyen', 'halinh', 'huukhang'],
        mentors: ['minhquan'],
        projectAdvisors: ['huudang', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Amazon',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  huukhang: {
    name: 'Huu Khang',
    firstLast: 'Khang Nguyen',
    alias: 'huukhang',
    trackingName: 'Hữu Khang',
    hobbies: 'J-pop, gaming, anime',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/huukhang.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ UMass. Amherst',
        roles: [MentorshipRole.SWE_MENTEE],
        offers: [
          {
            name: CompanyName.HIGHMARK_HEALTH,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-03-14',
          },
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
        teammates: ['hoangnguyen', 'halinh', 'khanhlinh'],
        mentors: ['phuocong'],
        projectAdvisors: ['huudang', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Amazon',
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  trangdo: {
    name: 'Lien Trang',
    firstLast: 'Trang Do',
    alias: 'trangdo',
    trackingName: 'Trang Đỗ',
    hobbies: 'kdrama, cooking, Vpop',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/trangdo.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Northeastern',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  haianh: {
    name: 'Hai Anh',
    firstLast: 'Anh Nguyen',
    alias: 'haianh',
    trackingName: 'Hải Anh',
    hobbies: 'walking, bike riding, road trip',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/haianh.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Fordham',
        roles: [MentorshipRole.SWE_MENTEE],
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  namnguyen: {
    name: 'Nam Nguyen',
    firstLast: 'Nam Nguyen',
    alias: 'namnguyen',
    trackingName: 'Nam',
    hobbies: 'soccer, One Piece, piano',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/namnguyen.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ MSU',
        roles: [MentorshipRole.SWE_MENTEE],
        offers: [
          {
            name: CompanyName.HEALTH_ENHANCEMENT_SYSTEMS,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-03-20',
          },
        ],
        teamName: 'Peace Pod',
        teamNumber: 6,
        teamRanking: 6,
        teammates: ['trangdo', 'haianh', 'thanhnguyen'],
        mentors: ['jennyquach'],
        projectAdvisors: ['khuetang', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Health Enhancement Systems',
        roles: [MentorshipRole.SWE_EXMENTEE_LOGISTICS_SUPPORT],
      },
    ],
  },
  trihoang: {
    name: 'Tri Hoang',
    firstLast: 'Tri Hoang',
    alias: 'trihoang',
    trackingName: 'Trí',
    hobbies: 'sports, traveling, movies',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/trihoang.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Rice',
        roles: [MentorshipRole.SWE_MENTEE],
        offers: [
          {
            name: CompanyName.AMAZON,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-03-13',
          },
          {
            name: CompanyName.BLOOMBERG,
            type: OfferType.INTERNSHIP,
            channel: OfferChannel.EXTERNAL,
            date: '2025-03-12',
          },
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
        roles: [MentorshipRole.SWE_EXMENTEE_MENTOR],
      },
    ],
  },
  vannguyen: {
    name: 'Van Nguyen',
    firstLast: 'Van Nguyen',
    alias: 'vannguyen',
    trackingName: 'Vân',
    hobbies: 'kdrama, tarot, drums',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/vannguyen.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Soka',
        roles: [MentorshipRole.SWE_MENTEE],
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
        mentors: ['thienson'],
        projectAdvisors: ['nickdoan', 'khoale'],
      },
      {
        year: 2025,
        title: 'SWE Intern @ Microsoft',
        roles: [
          MentorshipRole.SWE_RISING_LEAD,
          MentorshipRole.SWE_EXMENTEE_MENTOR,
        ],
      },
    ],
  },
  khatran: {
    name: 'Kha Tran',
    firstLast: 'Kha Tran',
    alias: 'khatran',
    trackingName: 'Kha',
    hobbies: 'coding, reading, gaming',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/khatran.jpg',
    terms: [
      {
        year: 2024,
        title: 'Student @ Manitoba',
        roles: [MentorshipRole.SWE_MENTEE],
        teamName: 'Tourific',
        teamNumber: 7,
        teamRanking: 7,
        teammates: ['trihoang', 'trangvu', 'vannguyen'],
        mentors: ['khuetang'],
        projectAdvisors: ['nickdoan', 'khoale'],
      },
    ],
  },
  huequan: {
    name: 'Hue Quan',
    firstLast: 'Quan Vu',
    alias: 'huequan',
    trackingName: 'Huệ Quân',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/huequan.jpg',
    terms: [
      {
        year: 2025,
        title: 'Product Design Intern @ Meta',
        roles: [MentorshipRole.PD_MENTOR],
      },
    ],
  },
  tranvo: {
    name: 'Tran Vo',
    firstLast: 'Tran Vo',
    alias: 'tranvo',
    trackingName: 'Trân',
    hobbies: 'museums, cafe-hopping, Disneyland',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/tranvo.jpg',
    terms: [
      {
        year: 2025,
        title: 'UX Designer @ Vanguard',
        roles: [MentorshipRole.PD_MENTOR],
      },
    ],
  },
  diepnguyen: {
    name: 'Diep Nguyen',
    firstLast: 'Diep Nguyen',
    alias: 'diepnguyen',
    trackingName: 'Diệp',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/diepnguyen.jpg',
    terms: [
      {
        year: 2025,
        title: 'Product Design Intern @ Microsoft',
        roles: [MentorshipRole.PD_MENTOR],
      },
    ],
  },
  phuctruong: {
    name: 'Phuc Truong',
    firstLast: 'Phuc Truong',
    alias: 'phuctruong',
    trackingName: 'Jun',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/phuctruong.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ USF',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  antran: {
    name: 'An Tran',
    firstLast: 'An Tran',
    alias: 'antran',
    trackingName: 'Ân',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/antran.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Orange Coast',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  quangminh: {
    name: 'Quang Minh',
    firstLast: 'Minh Nguyen',
    alias: 'quangminh',
    trackingName: 'Quang Minh',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/quangminh.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ FSU',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  dangson: {
    name: 'Dang Son',
    firstLast: 'Son Mai',
    alias: 'dangson',
    trackingName: 'Đăng Sơn',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/dangson.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Western Governors',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  ngoclinh: {
    name: 'Ngoc Linh',
    firstLast: 'Linh Le',
    alias: 'ngoclinh',
    trackingName: 'Ngọc Linh',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/ngoclinh.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Mount Holyoke',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  ducnguyen: {
    name: 'Duc Nguyen',
    firstLast: 'Duc Nguyen',
    alias: 'ducnguyen',
    trackingName: 'Đức',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/ducnguyen.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ George Mason',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  xuananh: {
    name: 'Xuan Anh',
    firstLast: 'Anh Tran',
    alias: 'xuananh',
    trackingName: 'Xuân Anh',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/xuananh.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Soka',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  datvu: {
    name: 'Dat Vu',
    firstLast: 'Dat Vu',
    alias: 'datvu',
    trackingName: 'Đạt',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/datvu.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ CSUSM',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  chautran: {
    name: 'Chau Tran',
    firstLast: 'Chau Tran',
    alias: 'chautran',
    trackingName: 'Châu Trần',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/chautran.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ UMass. Amherst',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  tuananh: {
    name: 'Tuan Anh',
    firstLast: 'Anh Ngo',
    alias: 'tuananh',
    trackingName: 'Tuấn Anh',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/tuananh.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Colby',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  quyendoan: {
    name: 'Quyen Doan',
    firstLast: 'Quyen Doan',
    alias: 'quyendoan',
    trackingName: 'Quyên',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/quyendoan.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Augustana',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  nhatle: {
    name: 'Nhat Le',
    firstLast: 'Nhat Le',
    alias: 'nhatle',
    trackingName: 'Nhật',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/nhatle.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Iowa State',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  dannguyen: {
    name: 'Dan Nguyen',
    firstLast: 'Dan Nguyen',
    alias: 'dannguyen',
    trackingName: 'Đan',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/dannguyen.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ George Mason',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  tamnguyen: {
    name: 'Tam Nguyen',
    firstLast: 'Tam Nguyen',
    alias: 'tamnguyen',
    trackingName: 'Tâm Nguyễn',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/tamnguyen.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Minerva',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  thaidang: {
    name: 'Thai Dang',
    firstLast: 'Dang Nguyen',
    alias: 'thaidang',
    trackingName: 'Thái Đăng',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/thaidang.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ UMass. Amherst',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  ngocminh: {
    name: 'Ngoc Minh',
    firstLast: 'Minh Le',
    alias: 'ngocminh',
    trackingName: 'Ngọc Minh',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/ngocminh.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Dickinson',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  tringuyen: {
    name: 'Tri Nguyen',
    firstLast: 'Tri Nguyen',
    alias: 'tringuyen',
    trackingName: 'Trí Nguyễn',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/tringuyen.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Minerva',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  tamdang: {
    name: 'Tam Dang',
    firstLast: 'Tam Dang',
    alias: 'tamdang',
    trackingName: 'Tâm Đặng',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/tamdang.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ USF',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  kevindoan: {
    name: 'Kevin Doan',
    firstLast: 'Kevin Doan',
    alias: 'kevindoan',
    trackingName: 'Kevin Đoàn',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/kevindoan.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ TCU',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  thuylinh: {
    name: 'Thuy Linh',
    firstLast: 'Linh Nguyen',
    alias: 'thuylinh',
    trackingName: 'Thùy Linh',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/thuylinh.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ FSU',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  kientran: {
    name: 'Kien Tran',
    firstLast: 'Kien Tran',
    alias: 'kientran',
    trackingName: 'Kiên Trần',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/kientran.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Lehigh',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  hanguyen: {
    name: 'Ha Nguyen',
    firstLast: 'Ha Nguyen',
    alias: 'hanguyen',
    trackingName: 'Hà Nguyễn',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/hanguyen.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Tufts',
        roles: [MentorshipRole.SWE_MENTEE],
      },
    ],
  },
  uyenhoang: {
    name: 'Uyen Hoang',
    firstLast: 'Uyen Hoang',
    alias: 'uyenhoang',
    trackingName: 'Uyên',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/uyenhoang.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Cornell',
        roles: [MentorshipRole.PD_MENTEE],
      },
    ],
  },
  ngocanhhoang: {
    name: 'Ngoc Anh Hoang',
    firstLast: 'Anh Hoang',
    alias: 'ngocanhhoang',
    trackingName: 'Ngọc Anh Hoàng',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/ngocanhhoang.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ Tufts',
        roles: [MentorshipRole.PD_MENTEE],
      },
    ],
  },
  monicahuynh: {
    name: 'Monica Huynh',
    firstLast: 'Monica Huynh',
    alias: 'monicahuynh',
    trackingName: 'Monica',
    hobbies: '',
    avatar:
      'https://res.cloudinary.com/khoa165/image/upload/v1745035535/viettech/people/monicahuynh.jpg',
    terms: [
      {
        year: 2025,
        title: 'Student @ UBC',
        roles: [MentorshipRole.PD_MENTEE],
      },
    ],
  },
};
