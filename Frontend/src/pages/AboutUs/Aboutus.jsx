import React from "react";

const teamMembers = [
  { 
    name: 'Om Aditya', 
    role: 'Senior Frontend Engineer', 
    color: '#4C4C9D',
    image: 'om.jpg',
    socials: { github: '#', linkedin: '#', email: 'mailto:om@gmail.com' }
  },
  { 
    name: 'Sujan Sahoo', 
    role: 'Junior Frontend Engineer', 
    color: '#5E5E32',
    image: 'sujan.jpg',
    socials: { github: '#', linkedin: '#', email: 'mailto:sujansahoo27@gmail.com' }
  },
  { 
    name: 'Rohit Kumar', 
    role: 'Software Backend Engineer', 
    color: '#007A99',
    image: 'rohit.jpg',
    socials: { github: '#', linkedin: '#', email: 'mailto:om@gmail.com' }
  },
  { 
    name: 'Onkar Raj', 
    role: 'Junior Backend Engineer', 
    color: '#6B2D82',
    image: 'onkar.jpg',
    socials: { github: '#', linkedin: '#', email: 'mailto:om@gmail.com' }
  }
];

// Pixel-art SVG Icons
const Icons = {
  github: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 2H4v2H2v8h2v2h2v2h2v2h8v-2h2v-2h2v-2h2V4h-2V2h-8v2h-2V2zm6 4v6h-2v2h-2v2h-4v-2H8v-2H6V6h12z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M4 2h4v4H4V2zm0 6h4v14H4V8zm6 0h4v2h2c1-1 2-2 4-2 3 0 5 2 5 6v8h-4v-7c0-2-1-3-3-3s-3 1-3 3v7h-4V8z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M2 4h20v2H2V4zm0 4h2v2h2v2h2v2h4v-2h2v-2h2v-2h2v12H2V8zm4 4v2h2v-2H6zm10 0v2h2v-2h-2z" />
    </svg>
  )
};

function AboutUs() {
  return (
    <section style={{ 
      backgroundColor: '#0F1123', 
      minHeight: '100vh', 
      padding: '60px 20px', 
      color: 'white', 
      textAlign: 'center', 
      fontFamily: '"ArcadeClassic", monospace' 
    }}>
      <style>
        {`
          @font-face {
            font-family: 'ArcadeClassic';
            src: url('/ARCADECLASSIC.TTF') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          
          .pixel-font {
            font-family: 'ArcadeClassic', sans-serif;
            text-transform: uppercase;
          }

          .team-photo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            image-rendering: pixelated;
          }

          .social-icon {
            width: 32px;
            height: 32px;
            background-color: #2D2D44;
            border: 2px solid #4A4A6A;
            display: flex;
            alignItems: center;
            justify-content: center;
            color: #A1A1C1;
            transition: all 0.2s;
            text-decoration: none;
          }

          .social-icon:hover {
            background-color: #4A4A6A;
            color: white;
            transform: translateY(-2px);
            border-color: white;
          }
        `}
      </style>

      {/* Header Section */}
      <h2 className="pixel-font" style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '4px' }}>
        Meet The Team
      </h2>
      <p style={{ color: '#A1A1C1', maxWidth: '600px', margin: '0 auto 60px auto', lineHeight: '1.6', fontFamily: 'monospace' }}>
        The folks behind Code Quest.<br />
      </p>

      {/* Team Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        {teamMembers.map((member) => (
          <div key={member.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* The "Folder" Card */}
            <div style={{ 
              backgroundColor: '#D9D9C3', 
              padding: '20px 12px 8px 12px', 
              position: 'relative', 
              borderRight: '6px solid rgba(0,0,0,0.2)', 
              borderBottom: '6px solid rgba(0,0,0,0.2)',
              width: '180px'
            }}>
              {/* Profile Image Box */}
              <div style={{ 
                backgroundColor: member.color, 
                height: '160px', 
                border: '4px solid #2D2D2D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {member.image ? (
                  <img src={member.image} alt={member.name} className="team-photo" />
                ) : (
                  <div style={{ fontSize: '60px' }}>👤</div>
                )}
              </div>

              {/* Name Tag */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0 5px 0', gap: '8px' }}>
                <div style={{ 
                  width: '10px', height: '10px', backgroundColor: '#FF4136', 
                  borderRadius: '50%', boxShadow: '0 0 10px #FF4136', border: '1px solid #700'
                }} />
                <span className="pixel-font" style={{ color: '#2D2D2D', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                  {member.name.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Role Label */}
            <p style={{ marginTop: '15px', fontSize: '0.9rem', fontWeight: '500', opacity: 0.9 }}>
              {member.role}
            </p>
            
            {/* Social Icons Section */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <a href={member.socials.github} className="social-icon" title="GitHub">
                {Icons.github}
              </a>
              <a href={member.socials.linkedin} className="social-icon" title="LinkedIn">
                {Icons.linkedin}
              </a>
              <a href={member.socials.email} className="social-icon" title="Email">
                {Icons.email}
              </a>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}

export default AboutUs;