// Data awal (demo). Disimpan di localStorage setelah dipakai; "Reset demo data" di menu ··· untuk mengembalikan.
window.SEED = (function () {
  const team = [
    { i: 'B', name: 'Bella Hart', color: '#ddd6fe', fg: '#6d28d9' },
    { i: 'K', name: 'Keyvan Akath', color: '#bfdbfe', fg: '#1d4ed8' },
    { i: 'J', name: 'Jamal Idris', color: '#fde68a', fg: '#a16207' },
    { i: 'R', name: 'Rina Saputri', color: '#fbcfe8', fg: '#be185d' },
  ];
  let n = 0;
  const d = (id, title, price, pri, stage, cc, date, client, phone, source, tm, cb, files, created, type) => ({
    id, title, price, pri, stage, cc, date, client, phone, source, team: tm, cb, files, created: created || '2026-10-20',
    type: type || 'Apartment', comments: [],
  });
  const deals = [
    {
      "id": "#FRT-00101",
      "propId": 1,
      "title": "Cluster Hollywood Vibes — Gading Serpong",
      "price": 3000000000,
      "pri": "Low",
      "stage": "new",
      "cc": "ID",
      "date": "2026-11-25",
      "client": "Budi Santoso",
      "phone": "+62 812 3344 5501",
      "source": "Instagram",
      "team": [
        "B",
        "K"
      ],
      "cb": 3,
      "files": 1,
      "created": "2026-11-08",
      "type": "rumah",
      "comments": [
        {
          "by": "Bella Hart",
          "text": "Klien minta denah lantai 3 dan simulasi KPR.",
          "at": "2026-11-09 10:12"
        },
        {
          "by": "Keyvan Akath",
          "text": "Denah dan simulasi sudah dikirim via WhatsApp.",
          "at": "2026-11-09 16:40"
        }
      ]
    },
    {
      "id": "#FRT-00102",
      "propId": 2,
      "title": "Cluster American Vibes — Gading Serpong",
      "price": 2000000000,
      "pri": "Low",
      "stage": "new",
      "cc": "ID",
      "date": "2026-11-27",
      "client": "Rina Wijaya",
      "phone": "+62 813 2201 9087",
      "source": "fortis.frel.cloud",
      "team": [
        "J",
        "R"
      ],
      "cb": 5,
      "files": 2,
      "created": "2026-11-09",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00103",
      "propId": 21,
      "title": "Park Serpong Affordable Home — Serpong",
      "price": 600000000,
      "pri": "Medium",
      "stage": "new",
      "cc": "ID",
      "date": "2026-12-01",
      "client": "Andi Pratama",
      "phone": "+62 857 4410 2233",
      "source": "Meta Ads",
      "team": [
        "B"
      ],
      "cb": 2,
      "files": 1,
      "created": "2026-11-10",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00104",
      "propId": 18,
      "title": "Alam Sutera New Cluster — Alam Sutera",
      "price": 1100000000,
      "pri": "Medium",
      "stage": "new",
      "cc": "ID",
      "date": "2026-12-03",
      "client": "Dewi Lestari",
      "phone": "+62 878 9012 3345",
      "source": "Instagram",
      "team": [
        "K",
        "J"
      ],
      "cb": 4,
      "files": 2,
      "created": "2026-11-10",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00105",
      "propId": 7,
      "title": "Legok Lakeview Residence — Legok",
      "price": 550000000,
      "pri": "High",
      "stage": "new",
      "cc": "ID",
      "date": "2026-12-05",
      "client": "Yoga Permana",
      "phone": "+62 821 5566 7788",
      "source": "WhatsApp",
      "team": [
        "R"
      ],
      "cb": 6,
      "files": 3,
      "created": "2026-11-07",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00106",
      "propId": 4,
      "title": "BSD Premium Launching — BSD City",
      "price": 7000000000,
      "pri": "Medium",
      "stage": "viewing",
      "cc": "ID",
      "date": "2026-11-21",
      "client": "Hendra Gunawan",
      "phone": "+62 811 2233 4455",
      "source": "Referral",
      "team": [
        "J",
        "R"
      ],
      "cb": 12,
      "files": 6,
      "created": "2026-10-14",
      "type": "rumah",
      "comments": [
        {
          "by": "Jamal Idris",
          "text": "Survei lokasi dikonfirmasi 21 Nov pukul 14.00.",
          "at": "2026-11-10 09:05"
        }
      ]
    },
    {
      "id": "#FRT-00107",
      "propId": 12,
      "title": "Sinarmas BSD Affordable Home — BSD City",
      "price": 1800000000,
      "pri": "Low",
      "stage": "viewing",
      "cc": "ID",
      "date": "2026-11-23",
      "client": "Sari Kusuma",
      "phone": "+62 812 7788 9900",
      "source": "Instagram",
      "team": [
        "B",
        "K"
      ],
      "cb": 4,
      "files": 3,
      "created": "2026-10-30",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00108",
      "propId": 11,
      "title": "Giantara Affordable Home — Serpong",
      "price": 700000000,
      "pri": "Medium",
      "stage": "viewing",
      "cc": "ID",
      "date": "2026-11-24",
      "client": "Fajar Ramadhan",
      "phone": "+62 896 1122 3344",
      "source": "fortis.frel.cloud",
      "team": [
        "R",
        "B"
      ],
      "cb": 6,
      "files": 3,
      "created": "2026-10-22",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00109",
      "propId": 3,
      "title": "Navapark Premium Residence — BSD City",
      "price": 15000000000,
      "pri": "Low",
      "stage": "negotiation",
      "cc": "ID",
      "date": "2026-11-22",
      "client": "Michael Tanuwijaya",
      "phone": "+62 811 9988 7766",
      "source": "Referral",
      "team": [
        "B",
        "R",
        "K"
      ],
      "cb": 23,
      "files": 10,
      "created": "2026-09-28",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00110",
      "propId": 5,
      "title": "Eastvara Luxury Cluster — BSD City",
      "price": 6000000000,
      "pri": "Low",
      "stage": "negotiation",
      "cc": "ID",
      "date": "2026-11-29",
      "client": "Linda Halim",
      "phone": "+62 812 5544 3322",
      "source": "Pameran",
      "team": [
        "B",
        "R"
      ],
      "cb": 17,
      "files": 9,
      "created": "2026-10-02",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00111",
      "propId": 15,
      "title": "Tresor BSD — BSD City",
      "price": 11600000000,
      "pri": "Medium",
      "stage": "negotiation",
      "cc": "ID",
      "date": "2026-11-30",
      "client": "Hartono Wibowo",
      "phone": "+62 818 3344 2211",
      "source": "WhatsApp",
      "team": [
        "J"
      ],
      "cb": 9,
      "files": 4,
      "created": "2026-10-12",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00112",
      "propId": 10,
      "title": "CBD Serpong Luxury Home — Gading Serpong",
      "price": 3900000000,
      "pri": "High",
      "stage": "legal",
      "cc": "ID",
      "date": "2026-11-30",
      "client": "Vivian Chandra",
      "phone": "+62 877 6655 4433",
      "source": "Referral",
      "team": [
        "J",
        "B",
        "R",
        "K"
      ],
      "cb": 34,
      "files": 12,
      "created": "2026-09-10",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00113",
      "propId": 14,
      "title": "Praja Nirbana Residence — Serpong",
      "price": 1400000000,
      "pri": "Medium",
      "stage": "won",
      "cc": "ID",
      "date": "2026-11-02",
      "client": "Eko Prasetyo",
      "phone": "+62 856 4433 2211",
      "source": "Instagram",
      "team": [
        "K",
        "R"
      ],
      "cb": 21,
      "files": 14,
      "created": "2026-09-20",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00114",
      "propId": 8,
      "title": "Summarecon Bitung Residence — Summarecon Tangerang",
      "price": 950000000,
      "pri": "Low",
      "stage": "won",
      "cc": "ID",
      "date": "2026-10-28",
      "client": "Nadia Putri",
      "phone": "+62 822 1100 9988",
      "source": "Meta Ads",
      "team": [
        "B"
      ],
      "cb": 7,
      "files": 5,
      "created": "2026-09-25",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00115",
      "propId": 20,
      "title": "Summarecon Lakeview Residence — Summarecon Tangerang",
      "price": 2000000000,
      "pri": "Low",
      "stage": "new",
      "cc": "ID",
      "date": "2026-12-08",
      "client": "Teguh Santosa",
      "phone": "+62 815 7788 6655",
      "source": "fortis.frel.cloud",
      "team": [
        "K"
      ],
      "cb": 2,
      "files": 1,
      "created": "2026-11-10",
      "type": "rumah",
      "comments": []
    },
    {
      "id": "#FRT-00116",
      "propId": 19,
      "title": "Grand Boulevard Shophouse — Gading Serpong",
      "price": 3200000000,
      "pri": "Medium",
      "stage": "viewing",
      "cc": "ID",
      "date": "2026-11-26",
      "client": "CV Maju Bersama",
      "phone": "+62 21 5566 7788",
      "source": "WhatsApp",
      "team": [
        "J",
        "K"
      ],
      "cb": 5,
      "files": 2,
      "created": "2026-10-25",
      "type": "ruko",
      "comments": []
    }
  ];

  const leads = [
    {
      "id": "L-201",
      "name": "Ahmad Fauzi",
      "phone": "+62 812 4400 1122",
      "interest": "Rumah 3 KT, Gading Serpong",
      "budget": "Rp 2 M",
      "source": "Instagram",
      "status": "New",
      "agent": "B",
      "created": "2026-11-10"
    },
    {
      "id": "L-202",
      "name": "Clarissa Tan",
      "phone": "+62 813 7788 4455",
      "interest": "Cluster premium BSD City",
      "budget": "Rp 7 M",
      "source": "fortis.frel.cloud",
      "status": "Contacted",
      "agent": "K",
      "created": "2026-11-09"
    },
    {
      "id": "L-203",
      "name": "Rudi Hermawan",
      "phone": "+62 857 3322 1100",
      "interest": "Rumah subsidi DP, Serpong",
      "budget": "Rp 700 jt",
      "source": "Meta Ads",
      "status": "Qualified",
      "agent": "J",
      "created": "2026-11-08"
    },
    {
      "id": "L-204",
      "name": "Siti Nurhaliza",
      "phone": "+62 878 5566 7788",
      "interest": "Rumah 2 lantai, Alam Sutera",
      "budget": "Rp 1,1 M",
      "source": "WhatsApp",
      "status": "New",
      "agent": "R",
      "created": "2026-11-08"
    },
    {
      "id": "L-205",
      "name": "Kevin Susanto",
      "phone": "+62 811 2200 3344",
      "interest": "Ruko CBD Gading Serpong",
      "budget": "Rp 3,2 M",
      "source": "Referral",
      "status": "Qualified",
      "agent": "B",
      "created": "2026-11-06"
    },
    {
      "id": "L-206",
      "name": "Maya Anggraini",
      "phone": "+62 821 8899 0011",
      "interest": "Rumah dekat BSD, KPR",
      "budget": "Rp 600 jt",
      "source": "Instagram",
      "status": "Contacted",
      "agent": "J",
      "created": "2026-11-05"
    },
    {
      "id": "L-207",
      "name": "Dimas Aditya",
      "phone": "+62 896 4455 6677",
      "interest": "Rumah mewah Alam Sutera",
      "budget": "Rp 29 M",
      "source": "Pameran",
      "status": "Lost",
      "agent": "K",
      "created": "2026-11-03"
    },
    {
      "id": "L-208",
      "name": "Putri Maharani",
      "phone": "+62 822 3344 5566",
      "interest": "Rumah view danau, Legok",
      "budget": "Rp 550 jt",
      "source": "Instagram",
      "status": "New",
      "agent": "R",
      "created": "2026-11-02"
    }
  ];

  const tasks = [
    {
      "id": 1,
      "title": "Hubungi Budi Santoso soal simulasi KPR",
      "due": "2026-11-12",
      "pri": "High",
      "done": false
    },
    {
      "id": 2,
      "title": "Siapkan survei lokasi untuk Hendra Gunawan (BSD Premium)",
      "due": "2026-11-20",
      "pri": "Medium",
      "done": false
    },
    {
      "id": 3,
      "title": "Kirim draft PPJB ke Vivian Chandra",
      "due": "2026-11-13",
      "pri": "High",
      "done": false
    },
    {
      "id": 4,
      "title": "Perbarui foto listing Legok Lakeview",
      "due": "2026-11-15",
      "pri": "Low",
      "done": false
    },
    {
      "id": 5,
      "title": "Follow up penawaran Michael Tanuwijaya",
      "due": "2026-11-14",
      "pri": "Medium",
      "done": false
    },
    {
      "id": 6,
      "title": "Kumpulkan KTP & NPWP — Eko Prasetyo",
      "due": "2026-11-04",
      "pri": "Low",
      "done": true
    },
    {
      "id": 7,
      "title": "Jadwalkan fotografer untuk Alam Sutera Ultimate Prestige",
      "due": "2026-11-18",
      "pri": "Medium",
      "done": false
    },
    {
      "id": 8,
      "title": "Laporan komisi bulanan",
      "due": "2026-11-30",
      "pri": "Low",
      "done": false
    }
  ];

  const contacts = [
    {
      "id": 1,
      "name": "Budi Santoso",
      "phone": "+62 812 3344 5501",
      "email": "budi.santoso@mail.com",
      "company": "Wiraswasta",
      "type": "Buyer",
      "country": "Indonesia"
    },
    {
      "id": 2,
      "name": "Hendra Gunawan",
      "phone": "+62 811 2233 4455",
      "email": "hendra@gunawan.co.id",
      "company": "PT Gunawan Jaya",
      "type": "Investor",
      "country": "Indonesia"
    },
    {
      "id": 3,
      "name": "Michael Tanuwijaya",
      "phone": "+62 811 9988 7766",
      "email": "michael.t@mail.com",
      "company": "Tanuwijaya Group",
      "type": "Buyer",
      "country": "Indonesia"
    },
    {
      "id": 4,
      "name": "Vivian Chandra",
      "phone": "+62 877 6655 4433",
      "email": "vivian.c@mail.com",
      "company": "Independen",
      "type": "Buyer",
      "country": "Indonesia"
    },
    {
      "id": 5,
      "name": "Eko Prasetyo",
      "phone": "+62 856 4433 2211",
      "email": "eko.p@mail.com",
      "company": "Independen",
      "type": "Buyer",
      "country": "Indonesia"
    },
    {
      "id": 6,
      "name": "Hartono Wibowo",
      "phone": "+62 818 3344 2211",
      "email": "hartono@wibowo.id",
      "company": "Wibowo Properti",
      "type": "Seller",
      "country": "Indonesia"
    },
    {
      "id": 7,
      "name": "Sinarmas Land (Sales Office)",
      "phone": "+62 21 5380 0000",
      "email": "sales@sinarmasland.example",
      "company": "Sinarmas Land",
      "type": "Partner",
      "country": "Indonesia"
    },
    {
      "id": 8,
      "name": "Paramount Land (Marketing)",
      "phone": "+62 21 5421 0000",
      "email": "marketing@paramount.example",
      "company": "Paramount Land",
      "type": "Partner",
      "country": "Indonesia"
    }
  ];

  const threads = [
    {
      "id": 1,
      "name": "Hendra Gunawan",
      "unread": 2,
      "msgs": [
        {
          "from": "them",
          "text": "Halo, bisa survei dimajukan jam 15.00?",
          "at": "09:41"
        },
        {
          "from": "me",
          "text": "Bisa Pak, saya update jadwalnya.",
          "at": "09:44"
        },
        {
          "from": "them",
          "text": "Tolong kirim juga rincian IPL dan biaya KPR.",
          "at": "10:02"
        }
      ]
    },
    {
      "id": 2,
      "name": "Michael Tanuwijaya",
      "unread": 3,
      "msgs": [
        {
          "from": "them",
          "text": "Kami bisa di Rp 14,5 M kalau furnitur sudah termasuk.",
          "at": "Kemarin"
        },
        {
          "from": "them",
          "text": "Mohon konfirmasi ke pemilik ya.",
          "at": "Kemarin"
        }
      ]
    },
    {
      "id": 3,
      "name": "Vivian Chandra",
      "unread": 3,
      "msgs": [
        {
          "from": "me",
          "text": "Draft PPJB sudah siap untuk Ibu review.",
          "at": "Sen"
        },
        {
          "from": "them",
          "text": "Terima kasih, notaris saya review hari ini.",
          "at": "Sen"
        }
      ]
    },
    {
      "id": 4,
      "name": "Budi Santoso",
      "unread": 0,
      "msgs": [
        {
          "from": "me",
          "text": "Selamat bergabung! Reservasi Bapak sudah kami konfirmasi.",
          "at": "Min"
        }
      ]
    }
  ];

  const properties = []; // loaded from the website: ../__fortis/properties.json

  const integrations = [
    { id: 'whatsapp', name: 'WhatsApp', desc: 'Chat with clients; the website forms already send to WhatsApp.', color: '#25d366', on: true },
    { id: 'gdrive', name: 'Google Drive', desc: 'Attach contracts and floor plans from Drive.', color: '#1a9b5b', on: true },
    { id: 'zoom', name: 'Zoom', desc: 'Schedule video viewings from a deal.', color: '#2d8cff', on: true },
    { id: 'slack', name: 'Slack', desc: 'Send deal updates to your team channels.', color: '#4a154b', on: false },
    { id: 'gmail', name: 'Gmail', desc: 'Log client emails against deals.', color: '#ea4335', on: false },
    { id: 'notion', name: 'Notion', desc: 'Sync notes and market research.', color: '#111111', on: false },
    { id: 'hubspot', name: 'HubSpot', desc: 'Import leads from marketing campaigns.', color: '#ff7a59', on: false },
  ];

  const notifs = [
    { id: 1, text: 'Michael Tanuwijaya sent a counter-offer on #FRT-00109', at: '2h ago', read: false },
    { id: 2, text: 'Survei lokasi dijadwalkan: Hendra Gunawan, 21 Nov 14.00', at: '5h ago', read: false },
    { id: 3, text: 'Lead baru dari Instagram: Ahmad Fauzi', at: 'Yesterday', read: false },
    { id: 4, text: 'Tugas jatuh tempo besok: Kirim draft PPJB', at: 'Yesterday', read: true },
  ];

  return {
    team, deals, leads, tasks, contacts, threads, properties, integrations, notifs,
    members: ['B', 'K', 'J', 'R'],
    months: [['May', 3.8], ['Jun', 5.2], ['Jul', 4.6], ['Aug', 7.1], ['Sep', 6.4], ['Oct', 9.3]],
    settings: { name: 'Keyvan Akath', email: 'keyvan@fortisrealty.id', workspace: 'Fortis Realty', ghRepo: 'SmittyWerbenn/fortis-realty', ghBranch: 'main', theme: 'light', notifyEmail: true, notifyPush: true, notifyDigest: false },
  };
})();
