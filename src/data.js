export const currentUser = {
  id: 'STU-2024-047', name: 'Rahul Sharma', initials: 'RS',
  role: 'student', institution: 'Delhi University', course: 'B.Sc Physics · Sem 4',
  email: 'rahul@du.ac.in', color: '#6366F1'
};

export const rooms = [
  {
    id: 'physics', name: 'Physics Sem 4', icon: '⚛️', color: 'rgba(99,102,241,0.18)',
    type: 'class', subject: 'B.Sc Physics', faculty: 'Dr. S. Mehta',
    members: 58, unread: 3, lastMsg: 'Dr. Mehta: Meet link for today shared',
    lastTime: '12m', code: 'XK92PL',
    facultyList: [
      { id:'FAC-001', name:'Dr. S. Mehta', initials:'SM', color:'#6366F1', role:'owner', online:true },
      { id:'FAC-002', name:'Prof. A. Khan', initials:'AK', color:'#8B5CF6', role:'faculty', online:false },
    ],
    studentList: [
      { id:'STU-2024-047', name:'Rahul Sharma', initials:'RS', color:'#6366F1', online:true, you:true },
      { id:'STU-2024-012', name:'Anjali Kulkarni', initials:'AK', color:'#10B981', online:true },
      { id:'STU-2024-031', name:'Priya Rajput', initials:'PR', color:'#F59E0B', online:true },
      { id:'STU-2024-058', name:'Vikram Kumar', initials:'VK', color:'#EC4899', online:false },
      { id:'STU-2024-023', name:'Sneha Patel', initials:'SP', color:'#14B8A6', online:false },
    ],
    messages: [
      { id:1, sender:'Dr. S. Mehta', sid:'FAC-001', initials:'SM', color:'#6366F1', text:"Good morning everyone! Today's session on Electrostatics starts at 10am sharp. Please be ready 🎓", time:'9:02 AM', me:false },
      { id:2, sender:'Dr. S. Mehta', sid:'FAC-001', initials:'SM', color:'#6366F1', text:'Session link for today 👇', time:'9:15 AM', me:false, link:{ icon:'🎥', name:'Google Meet — Physics Session 14', sub:'meet.google.com/phy-sess-14 · Tap to join' } },
      { id:3, sender:'Anjali Kulkarni', sid:'STU-2024-012', initials:'AK', color:'#10B981', text:'Thank you sir! Will be there on time 🙏', time:'9:18 AM', me:false },
      { id:4, sender:'Priya Rajput', sid:'STU-2024-031', initials:'PR', color:'#F59E0B', text:'Sir, I had a doubt about last week\'s derivation — sent you a message in the doubt thread', time:'9:21 AM', me:false },
      { id:5, sender:'Dr. S. Mehta', sid:'FAC-001', initials:'SM', color:'#6366F1', text:'Notes from last class 📄', time:'9:35 AM', me:false, file:{ icon:'📄', name:'Electrostatics_Ch3_Notes.pdf', size:'2.4 MB · PDF' } },
      { id:6, sender:'You', sid:'STU-2024-047', initials:'RS', color:'#6366F1', text:'Thanks sir! Will go through before the session 📚', time:'9:37 AM', me:true },
      { id:7, sender:'Vikram Kumar', sid:'STU-2024-058', initials:'VK', color:'#EC4899', text:'Can someone share the diagram from page 14? My PDF is not loading', time:'9:42 AM', me:false },
      { id:8, sender:'You', sid:'STU-2024-047', initials:'RS', color:'#6366F1', time:'9:44 AM', me:true, file:{ icon:'🖼️', name:'diagram_pg14.jpg', size:'Screenshot · 340 KB' } },
    ],
    notices: [
      { id:1, title:'Class rescheduled — Friday 10am', body:"Monday's class has been moved to Friday, same time (10am–11:30am). The Google Meet link will be shared 30 minutes before. Please update your calendars.", author:'Dr. S. Mehta', time:'2 hours ago', priority:'high', read:41, total:58 },
      { id:2, title:'Mid-semester exam schedule released', body:'Mid-semester exams are scheduled for 15th–20th of next month. Physics paper: 17th, 2pm–4pm, Hall B. Syllabus: Units 1–3. Detailed coverage list uploaded to Resources.', author:'Dr. S. Mehta', time:'Yesterday', priority:'normal', read:56, total:58 },
      { id:3, title:'College Annual Day — 25th January', body:'All students are invited to the Annual Day celebrations on 25th January at the Main Auditorium from 5pm. Cultural performances, prize distribution, and guest lecture.', author:'Institution Admin', time:'3 days ago', priority:'normal', read:58, total:58 },
    ],
    resources: [
      { id:1, icon:'📋', name:'Course Syllabus 2024–25', meta:'Dr. Mehta · PDF · 340 KB', pinned:true },
      { id:2, icon:'📅', name:'Exam Schedule — Sem 4', meta:'Admin · PDF · 210 KB', pinned:true },
      { id:3, icon:'📄', name:'Electrostatics Ch3 — Lecture Notes', meta:'Dr. Mehta · PDF · 2.4 MB · Today' },
      { id:4, icon:'📊', name:'Ch2 Magnetism — Slides', meta:'Dr. Mehta · PPT · 5.1 MB · Mon' },
      { id:5, icon:'📄', name:'Unit 1 Summary Sheet', meta:'Dr. Mehta · PDF · 890 KB · Last week' },
      { id:6, icon:'📝', name:'Mid-sem Practice Questions — Ch3 & 4', meta:'Dr. Mehta · PDF · 1.2 MB · Yesterday' },
      { id:7, icon:'📝', name:'Previous Year Paper 2023', meta:'Dr. Mehta · PDF · 780 KB · Last month' },
      { id:8, icon:'🖼️', name:'Diagram pg14 — Electrostatics', meta:'You · JPG · 340 KB · Today' },
      { id:9, icon:'📸', name:'Board notes — Session 13', meta:'Anjali K. · JPG · 2.1 MB · Mon' },
    ],
    attendance: { percent:87, attended:14, total:16,
      calendar:[
        null,null,'P',null,'P',null,null,
        'P','P','P',null,'P',null,null,
        'A','P','P',null,'P',null,null,
        'P','P','A',null,'P',null,null,
        'P','T'
      ],
      sessions:[
        { date:'28 Jan', topic:'Electrostatics — Ch3', status:'present' },
        { date:'24 Jan', topic:'Electrostatics — Ch3 intro', status:'present' },
        { date:'22 Jan', topic:'Magnetism — revision', status:'absent' },
        { date:'20 Jan', topic:'Magnetism — Ch2 continued', status:'present' },
        { date:'17 Jan', topic:'Magnetism — Ch2', status:'present' },
        { date:'13 Jan', topic:'Electric Fields', status:'absent' },
      ]
    }
  },
  {
    id:'maths', name:'Maths Sem 4', icon:'📐', color:'rgba(16,185,129,0.18)',
    type:'class', subject:'B.Sc Maths', faculty:'Prof. A. Khan',
    members:60, unread:0, lastMsg:'PDF: Practice sheet Ch4 uploaded', lastTime:'1h', code:'MT24PL',
    facultyList:[{ id:'FAC-003', name:'Prof. A. Khan', initials:'AK', color:'#10B981', role:'owner', online:true }],
    studentList:[
      { id:'STU-2024-047', name:'Rahul Sharma', initials:'RS', color:'#6366F1', online:true, you:true },
      { id:'STU-2024-012', name:'Anjali Kulkarni', initials:'AK', color:'#10B981', online:false },
    ],
    messages:[
      { id:1, sender:'Prof. A. Khan', sid:'FAC-003', initials:'AK', color:'#10B981', text:'Practice sheet for Chapter 4 uploaded to resources. Please attempt before next class.', time:'Yesterday', me:false, file:{ icon:'📄', name:'Practice_Sheet_Ch4.pdf', size:'1.1 MB · PDF' } },
      { id:2, sender:'You', sid:'STU-2024-047', initials:'RS', color:'#6366F1', text:'Thank you sir! 👍', time:'Yesterday', me:true },
    ],
    notices:[
      { id:1, title:'Unit test — Chapter 3 & 4', body:'Unit test next week covers Differential Equations (Ch3) and Matrices (Ch4). Practice questions uploaded.', author:'Prof. A. Khan', time:'Yesterday', priority:'high', read:55, total:60 },
    ],
    resources:[
      { id:1, icon:'📄', name:'Practice Sheet Ch4', meta:'Prof. Khan · PDF · 1.1 MB · Yesterday', pinned:false },
      { id:2, icon:'📊', name:'Differential Equations — Slides', meta:'Prof. Khan · PPT · 3.2 MB · Last week', pinned:false },
    ],
    attendance:{ percent:92, attended:11, total:12,
      calendar:[null,null,'P',null,'P',null,null,'P','P','P',null,'P',null,null,'P','P','P',null,'P',null,null,'P','P','P',null,'P',null,null,'P','T'],
      sessions:[
        { date:'28 Jan', topic:'Matrices — Ch4', status:'present' },
        { date:'24 Jan', topic:'Differential Equations', status:'present' },
        { date:'20 Jan', topic:'Integration techniques', status:'present' },
        { date:'13 Jan', topic:'Limits & continuity', status:'present' },
      ]
    }
  },
  {
    id:'chemistry', name:'Chemistry Sem 4', icon:'🧪', color:'rgba(245,158,11,0.18)',
    type:'class', subject:'B.Sc Chemistry', faculty:'Dr. P. Verma',
    members:55, unread:0, lastMsg:'You: Thanks sir 👍', lastTime:'3h', code:'CH24VR',
    facultyList:[{ id:'FAC-004', name:'Dr. P. Verma', initials:'PV', color:'#F59E0B', role:'owner', online:false }],
    studentList:[
      { id:'STU-2024-047', name:'Rahul Sharma', initials:'RS', color:'#6366F1', online:true, you:true },
    ],
    messages:[
      { id:1, sender:'Dr. P. Verma', sid:'FAC-004', initials:'PV', color:'#F59E0B', text:'Good afternoon all. Organic chemistry unit starts Monday.', time:'3h ago', me:false },
      { id:2, sender:'You', sid:'STU-2024-047', initials:'RS', color:'#6366F1', text:'Thanks sir 👍', time:'3h ago', me:true },
    ],
    notices:[],
    resources:[
      { id:1, icon:'📄', name:'Organic Chemistry — Unit 3 Notes', meta:'Dr. Verma · PDF · 3.1 MB', pinned:false },
    ],
    attendance:{ percent:76, attended:10, total:13,
      calendar:[null,null,'P',null,'A',null,null,'P','P','P',null,'A',null,null,'P','P','P',null,'P',null,null,'A','P','P',null,'P',null,null,'P','T'],
      sessions:[
        { date:'28 Jan', topic:'Organic Ch3 intro', status:'present' },
        { date:'24 Jan', topic:'Chemical bonding', status:'present' },
        { date:'22 Jan', topic:'Periodic table review', status:'absent' },
        { date:'17 Jan', topic:'Atomic structure', status:'present' },
        { date:'13 Jan', topic:'Basic concepts', status:'absent' },
        { date:'10 Jan', topic:'Introduction', status:'absent' },
      ]
    }
  },
  {
    id:'project', name:'Final Year Project', icon:'🚀', color:'rgba(139,92,246,0.18)',
    type:'team', subject:'Project Group', faculty:'Dr. R. Singh',
    members:5, unread:1, lastMsg:"Priya: I've updated the report draft", lastTime:'2h', code:'FYP24RS',
    facultyList:[{ id:'FAC-005', name:'Dr. R. Singh', initials:'RS2', color:'#8B5CF6', role:'owner', online:true }],
    studentList:[
      { id:'STU-2024-047', name:'Rahul Sharma', initials:'RS', color:'#6366F1', online:true, you:true },
      { id:'STU-2024-031', name:'Priya Rajput', initials:'PR', color:'#F59E0B', online:true },
      { id:'STU-2024-012', name:'Anjali Kulkarni', initials:'AK', color:'#10B981', online:false },
    ],
    messages:[
      { id:1, sender:'Dr. R. Singh', sid:'FAC-005', initials:'RS2', color:'#8B5CF6', text:'Team, please submit the Chapter 2 draft by Friday.', time:'Yesterday', me:false },
      { id:2, sender:'Priya Rajput', sid:'STU-2024-031', initials:'PR', color:'#F59E0B', text:"I've updated the report draft — please review!", time:'2h ago', me:false, file:{ icon:'📝', name:'FYP_Report_Draft_v2.docx', size:'Word Doc · 840 KB' } },
    ],
    notices:[
      { id:1, title:'Project submission deadline — 15th Feb', body:'Final report and presentation slides must be submitted by 15th February. No extensions will be granted.', author:'Dr. R. Singh', time:'2 days ago', priority:'high', read:4, total:5 },
    ],
    resources:[
      { id:1, icon:'📝', name:'FYP Report Draft v2', meta:'Priya R. · DOCX · 840 KB · Today', pinned:true },
      { id:2, icon:'📊', name:'Presentation Slides Draft', meta:'Rahul S. · PPT · 2.1 MB · Mon', pinned:false },
    ],
    attendance:{ percent:100, attended:8, total:8,
      calendar:[null,null,'P',null,'P',null,null,'P','P','P',null,'P',null,null,'P','P','P',null,'P',null,null,'P','P','P',null,'P',null,null,'P','T'],
      sessions:[
        { date:'28 Jan', topic:'Chapter 2 review', status:'present' },
        { date:'21 Jan', topic:'Research methodology', status:'present' },
        { date:'14 Jan', topic:'Literature review', status:'present' },
        { date:'7 Jan', topic:'Project kickoff', status:'present' },
      ]
    }
  },
  {
    id:'doubt-physics', name:'Doubts — Dr. Mehta', icon:'🙋', color:'rgba(248,113,113,0.15)',
    type:'private', subject:'Private thread', faculty:'Dr. S. Mehta',
    members:2, unread:0, lastMsg:'Dr. Mehta: Yes, that formula applies here', lastTime:'Yesterday', code:null,
    facultyList:[{ id:'FAC-001', name:'Dr. S. Mehta', initials:'SM', color:'#6366F1', role:'faculty', online:true }],
    studentList:[{ id:'STU-2024-047', name:'Rahul Sharma', initials:'RS', color:'#6366F1', online:true, you:true }],
    messages:[
      { id:1, sender:'You', sid:'STU-2024-047', initials:'RS', color:'#6366F1', text:'Sir, I had a question about the Gauss law derivation from last class. Is the formula E = Q/ε₀ applicable for all closed surfaces?', time:'Yesterday 8:45 PM', me:true },
      { id:2, sender:'Dr. S. Mehta', sid:'FAC-001', initials:'SM', color:'#6366F1', text:"Yes, that formula applies here — Gauss's law holds for any closed surface regardless of shape. The key condition is that the charge Q must be enclosed within the surface. Great question, Rahul!", time:'Yesterday 9:12 PM', me:false },
      { id:3, sender:'You', sid:'STU-2024-047', initials:'RS', color:'#6366F1', text:"That clears it up, thank you sir! 🙏 So the shape of the surface doesn't matter as long as the charge is inside?", time:'Yesterday 9:15 PM', me:true },
      { id:4, sender:'Dr. S. Mehta', sid:'FAC-001', initials:'SM', color:'#6366F1', text:"Exactly right! The flux depends only on the enclosed charge, not the surface geometry. We'll cover this with examples in tomorrow's class.", time:'Yesterday 9:20 PM', me:false },
    ],
    notices:[], resources:[],
    attendance:{ percent:100, attended:4, total:4, calendar:[], sessions:[] }
  }
];

export const overallAttendance = [
  { subject:'Physics Sem 4', percent:87, color:'#6366F1' },
  { subject:'Maths Sem 4', percent:92, color:'#10B981' },
  { subject:'Chemistry Sem 4', percent:76, color:'#F59E0B' },
  { subject:'Final Year Project', percent:100, color:'#8B5CF6' },
];
