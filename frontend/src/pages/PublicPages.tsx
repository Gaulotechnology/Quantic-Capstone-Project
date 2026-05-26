import React from 'react';
import { 
  Box, Typography, Container, Grid, Stack, alpha, Button, 
  Card, CardContent, Divider, Avatar, List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  Public as PublicIcon,
  Psychology as PsychologyIcon,
  Business as BusinessIcon,
  Groups as GroupsIcon,
  MenuBook as BookIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { LandingNav } from '../components/layout/LandingNav';
import { AppFooter } from '../components/layout/AppFooter';
import { useNavigate } from 'react-router-dom';

const PublicPageLayout: React.FC<{ 
  title: string; 
  subtitle?: string; 
  children: React.ReactNode; 
  dark?: boolean 
}> = ({ title, subtitle, children, dark }) => (
  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: dark ? '#0D1B2A' : '#F8FAFC' }}>
    <LandingNav />
    <Box sx={{ pt: 18, pb: 12, flex: 1 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              fontWeight: 700, 
              color: '#7EC845', 
              letterSpacing: '0.1em', 
              display: 'block', 
              mb: 1 
            }}
          >
            TUMAINI CONSULTANCY
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              color: dark ? '#fff' : '#1B2A4A', 
              letterSpacing: '-0.02em', 
              mb: 2 
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="h5" 
              sx={{ 
                color: dark ? 'rgba(255,255,255,0.7)' : 'text.secondary', 
                fontWeight: 400, 
                maxWidth: 700 
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {children}
      </Container>
    </Box>
    <AppFooter />
  </Box>
);

// ── 1. Exclusive Roles ──────────────────────────────────────────────

export const ExclusiveRolesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PublicPageLayout 
      title="Exclusive Mandates" 
      subtitle="Access high-impact opportunities managed exclusively by Tumaini AI for Africa's leading organizations."
    >
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
            {`At Tumaini, we don't just "list" jobs. We hold exclusive mandates for some of the most critical 
            technical and leadership positions on the continent. These are roles that are often not 
            advertised elsewhere, requiring a high level of discretion and specialized matching.`}
          </Typography>
          
          <Stack spacing={3}>
            {[
              { 
                title: 'High-Touch Representation', 
                desc: `Every candidate in our exclusive pool receives dedicated representation from an expert consultant who understands the nuances of the role and the company culture.` 
              },
              { 
                title: 'Direct Access to Decision Makers', 
                desc: `Our mandates involve direct partnership with CEOs, Founders, and VPs. Your application doesn't sit in a queue; it reaches the people who matter.` 
              },
              { 
                title: 'Confidentiality Guaranteed', 
                desc: `For senior executive or sensitive technical roles, we maintain the highest levels of privacy for both the candidate and the hiring organization.` 
              },
            ].map(item => (
              <Box key={item.title} sx={{ display: 'flex', gap: 2.5 }}>
                <CheckCircleIcon sx={{ color: '#7EC845', mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{item.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
          
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/candidate/jobs')}
            sx={{ mt: 6, px: 6, py: 2, borderRadius: 3 }}
          >
            View Active Mandates
          </Button>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: '#1B2A4A', color: '#fff', borderRadius: 4, p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Mandate Statistics</Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#7EC845' }}>85%</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Unadvertised Roles</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#7EC845' }}>12 Days</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Average Time to Shortlist</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#7EC845' }}>Executive</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>Level focus across Tech, Finance & Mining</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PublicPageLayout>
  );
};

// ── 2. Talent Mapping ───────────────────────────────────────────────

export const TalentMappingPage: React.FC = () => (
  <PublicPageLayout 
    title="Strategic Talent Mapping" 
    subtitle="Proactive market intelligence to identify and engage high-potential talent before a vacancy even exists."
  >
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>The AI Advantage</Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          Our Talent Mapping service goes beyond traditional headhunting. We use our proprietary AI 
          to scan the Pan-African tech landscape, identifying emerging leaders and specialized 
          technicians based on project history, skill trajectory, and market influence.
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          By mapping the competitive landscape, we help our clients understand the availability of 
          specific skills in different regions (e.g., "Where are the best Go engineers in Lagos vs Nairobi?") 
          allowing for data-backed expansion and hiring strategies.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {[
            { icon: <PublicIcon />, title: 'Geo-Intelligence', desc: 'Identify skill density by region.' },
            { icon: <PsychologyIcon />, title: 'Predictive Fit', desc: 'Predict candidate move-readiness.' },
            { icon: <BusinessIcon />, title: 'Competitor Insights', desc: 'Understand rival talent structures.' },
            { icon: <TrendingUpIcon />, title: 'Pipeline Building', desc: 'Nurture long-term prospects.' }
          ].map(f => (
            <Card key={f.title} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ color: '#7EC845', mb: 2 }}>{f.icon}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>{f.title}</Typography>
                <Typography variant="caption" color="text.secondary">{f.desc}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Grid>
    </Grid>
  </PublicPageLayout>
);

// ── 3. Partner with Us ──────────────────────────────────────────────

export const PartnerWithUsPage: React.FC = () => (
  <PublicPageLayout 
    title="Client Partnership" 
    subtitle="Empower your organization with a tech-enabled recruitment consultancy that actually delivers."
  >
    <Box sx={{ mb: 10 }}>
      <Grid container spacing={4}>
        {[
          { 
            title: 'Consultancy Excellence', 
            desc: 'We are partners, not vendors. We embed ourselves in your culture to understand what "top talent" means for your specific team.' 
          },
          { 
            title: 'AI Efficiency', 
            desc: 'Our proprietary tools allow our consultants to screen thousands of candidates with 98% accuracy, ensuring you only interview the best.' 
          },
          { 
            title: 'Transparent Pricing', 
            desc: 'From contingency-based placements to retained executive search, we offer flexible models designed around your ROI.' 
          }
        ].map(card => (
          <Grid size={{ xs: 12, md: 4 }} key={card.title}>
            <Box sx={{ p: 4, bgcolor: '#fff', borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', '&:hover': { borderColor: '#7EC845', boxShadow: '0 12px 40px rgba(0,0,0,0.05)' }, transition: 'all 0.3s ease' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>{card.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{card.desc}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>

    <Box sx={{ p: 6, bgcolor: '#1B2A4A', borderRadius: 6, color: '#fff', textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Start a Conversation</Typography>
      <Typography variant="body1" sx={{ opacity: 0.8, mb: 5, maxWidth: 600, mx: 'auto' }}>
        Ready to redefine your talent acquisition? Contact our lead consultants to discuss a tailored partnership.
      </Typography>
      <Button variant="contained" size="large" sx={{ px: 8, py: 2, borderRadius: 3, bgcolor: '#7EC845', fontWeight: 800 }}>
        Contact the Consultancy
      </Button>
    </Box>
  </PublicPageLayout>
);

// ── 4. Executive Search ─────────────────────────────────────────────

export const ExecutiveSearchPage: React.FC = () => (
  <PublicPageLayout 
    title="Executive Search" 
    subtitle="Bespoke, retained search mandates for C-Suite and Board-level leadership across Africa."
  >
    <Grid container spacing={8} sx={{ alignItems: "center" }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Elite Leadership Scouting</Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
          True leadership is the single most important variable in organizational success. Our 
          Executive Search division specializes in identifying and attracting the visionaries 
          required to navigate complex markets.
        </Typography>
        <List>
          {[
            'C-Suite (CEO, CTO, CFO, COO)',
            'Vice Presidents & Senior Directors',
            'Non-Executive Directors (Board)',
            'Specialist Technical Leads'
          ].map(text => (
            <ListItem key={text} disablePadding sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 32, color: '#7EC845' }}><StarIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary={text} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ position: 'relative', p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 6, bgcolor: alpha('#7EC845', 0.03) }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>The Tumaini Retained Model</Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontWeight: 900, color: '#7EC845' }}>01</Typography>
              <Typography variant="body2">Deep stakeholder alignment and role architecting.</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontWeight: 900, color: '#7EC845' }}>02</Typography>
              <Typography variant="body2">AI-augmented market mapping and shortlist generation.</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontWeight: 900, color: '#7EC845' }}>03</Typography>
              <Typography variant="body2">Rigorous psychometric and leadership competency testing.</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontWeight: 900, color: '#7EC845' }}>04</Typography>
              <Typography variant="body2">Negotiation mediation and executive onboarding support.</Typography>
            </Box>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  </PublicPageLayout>
);

// ── 5. About Us ─────────────────────────────────────────────────────

export const AboutPage: React.FC = () => (
  <PublicPageLayout 
    title="Our Mission & Story" 
    subtitle="We are Africa's first AI-native recruitment consultancy, bridging the gap between potential and performance."
  >
    <Grid container spacing={10}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Human Insight, Machine Intelligence</Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.9, mb: 4 }}>
          Founded in Johannesburg, Tumaini was built on a simple observation: traditional recruitment is 
          too slow and too biased for the high-velocity tech era. We set out to build a consultancy 
          where human consultants are supercharged by proprietary AI models.
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.9, mb: 4 }}>
          "Tumaini" means **Hope** in Swahili. We chose this name because we believe that the right job 
          for the right person creates a ripple effect of economic and personal prosperity across 
          families, organizations, and entire nations.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 6 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#7EC845' }}>10+</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Years Expertise</Typography>
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#7EC845' }}>5</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>African Hubs</Typography>
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#7EC845' }}>100%</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Success Rate</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Card sx={{ borderRadius: 6, bgcolor: '#1B2A4A', color: '#fff', p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Our Core Values</Typography>
          <Stack spacing={3}>
            {[
              { t: 'Integrity First', d: 'We provide honest feedback to candidates and clients, even when it is difficult.' },
              { t: 'Data Over Hype', d: 'We use objective AI scores to validate our consultants intuition.' },
              { t: 'African Excellence', d: 'We are committed to showcasing the absolute best talent our continent has to offer.' }
            ].map(v => (
              <Box key={v.t}>
                <Typography variant="subtitle2" sx={{ color: '#7EC845', mb: 0.5 }}>{v.t}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>{v.d}</Typography>
              </Box>
            ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  </PublicPageLayout>
);

// ── 6. Hiring Guide ────────────────────────────────────────────────

export const HiringGuidePage: React.FC = () => (
  <PublicPageLayout 
    title="The Tumaini Hiring Guide" 
    subtitle="Best practices for building elite teams in the African tech ecosystem."
  >
    <Grid container spacing={4}>
      {[
        { title: 'The Cost of a Mis-hire', icon: <BusinessIcon />, text: 'Learn why a single bad hire can cost your organization 3x their annual salary in lost productivity and morale.' },
        { title: 'Designing the Perfect Role', icon: <BookIcon />, text: 'How to write requirements that attract top talent while being realistic about the market supply.' },
        { title: 'Technical Assessment 2.0', icon: <PsychologyIcon />, text: 'Move beyond standard coding tests. Learn how to evaluate problem-solving and cultural adaptability.' },
        { title: 'Retention Strategies', icon: <GroupsIcon />, text: 'Hiring is only half the battle. How to keep your elite talent in a hyper-competitive global market.' }
      ].map(item => (
        <Grid size={{ xs: 12, sm: 6 }} key={item.title}>
          <Box sx={{ p: 4, borderRadius: 4, bgcolor: '#fff', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: alpha('#7EC845', 0.1), color: '#7EC845' }}>{item.icon}</Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{item.title}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>{item.text}</Typography>
            <Button variant="text" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700, p: 0 }}>Read More</Button>
          </Box>
        </Grid>
      ))}
    </Grid>
  </PublicPageLayout>
);

// ── 7. Legal (Privacy & Terms) ──────────────────────────────────────

export const PrivacyPolicyPage: React.FC = () => (
  <PublicPageLayout 
    title="Privacy & Data Protection" 
    subtitle="How we handle your information with the highest levels of security and compliance (POPIA & GDPR)."
  >
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>1. Data Collection</Typography>
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
        We collect candidate information (CVs, contact details, work history) solely for the purpose of 
        recruitment consultancy. We do not sell your data to third-party advertisers. 
        All AI analysis is performed in a secure, siloed environment.
      </Typography>
      
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>2. POPIA Compliance</Typography>
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
        As a South African headquartered consultancy, we are fully compliant with the Protection of 
        Personal Information Act (POPIA). You have the right to request access to your data or its 
        permanent deletion at any time.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>3. AI Transparency</Typography>
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
        Our AI serves to assist our human consultants, not replace them. We do not use fully 
        automated decision-making for hiring. A human consultant always reviews and validates 
        AI-generated shortlists.
      </Typography>
    </Box>
  </PublicPageLayout>
);

export const TermsOfServicePage: React.FC = () => (
  <PublicPageLayout 
    title="Terms of Service" 
    subtitle="The professional agreement between Tumaini Consultancy and its users."
  >
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>1. Consultancy Mandates</Typography>
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
        By applying through our platform, you authorize Tumaini to represent you to our partner 
        clients. We will always obtain your explicit consent before submitting your details for a 
        specific role.
      </Typography>
      
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>2. Intellectual Property</Typography>
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
        All AI algorithms, match scoring systems, and "Semantic Fit" methodologies are the 
        exclusive intellectual property of Tumaini Recruitment Consultancy.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>3. Liability</Typography>
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
        Tumaini provides recruitment recommendations based on data and expertise but does not 
        guarantee the future performance of any placed candidate. Final hiring decisions rest 
        solely with the client organization.
      </Typography>
    </Box>
  </PublicPageLayout>
);

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PublicPageLayout 
      title="Recruitment Consultancy & Sourcing Solutions" 
      subtitle="Supercharging human advisory with predictive AI algorithms to scale high-impact engineering teams across Africa."
    >
      {/* ── Section 1: Detailed Sourcing Pillars ────────────────── */}
      <Box sx={{ mb: 12 }}>
        <Typography 
          variant="h3" 
          sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.02em', color: '#1B2A4A', textAlign: 'center' }}
        >
          Our Core Recruitment Services
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ maxWidth: 700, mx: 'auto', textAlign: 'center', mb: 8, lineHeight: 1.7 }}
        >
          We partner with forward-thinking enterprises, high-growth startups, and international hubs to identify, assess, and onboard Africa's top 2% technical and leadership talent.
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: 'Executive Search & Leadership scouting',
              icon: <GroupsIcon sx={{ fontSize: 32 }} />,
              color: '#CD6DBB',
              desc: 'Dedicated retained mandates to recruit C-Suite (CEO, CTO, CFO), Vice Presidents, and Board-level leadership. Our senior consultants combine deep stakeholder alignment with automated candidate constraint mapping for discrete, high-impact placements.',
              bullets: ['Board & Director level sourcing', 'Pre-validated leadership fit scoring', 'Confidential executive onboarding support']
            },
            {
              title: 'Specialized Technical Sourcing',
              icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
              color: '#7EC845',
              desc: 'Scaling software engineering teams, DevOps pipelines, AI/ML laboratories, and data architectures. Powered by our proprietary RAG search engine, we bypass standard keyword matching to match candidates based on structural project experience and code quality indices.',
              bullets: ['Go, Python, Rust & TypeScript specialists', 'Cloud and Infrastructure engineers', 'Predictive technical capability auditing']
            },
            {
              title: 'Strategic Talent Mapping & Market Intel',
              icon: <PublicIcon sx={{ fontSize: 32 }} />,
              color: '#00A8CC',
              desc: 'Comprehensive market mapping across Africa\'s leading innovation capitals (Lagos, Nairobi, Johannesburg, Cape Town, Accra). We analyze local skill densities, competitive structures, and compensations, providing actionable insights for cross-border expansion.',
              bullets: ['Skill density geo-intelligence', 'Competitive salary benchmarking', 'Proactive executive pipeline construction']
            }
          ].map(service => (
            <Grid size={{ xs: 12, md: 4 }} key={service.title}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  bgcolor: '#ffffff',
                  border: '1px solid rgba(27, 42, 74, 0.05)',
                  borderRadius: 5,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 35px rgba(27, 42, 74, 0.05)',
                    borderColor: alpha(service.color, 0.2)
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 3, 
                    bgcolor: alpha(service.color, 0.08), 
                    color: service.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 3
                  }}
                >
                  {service.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#1B2A4A', lineHeight: 1.3 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.7, flex: 1 }}>
                  {service.desc}
                </Typography>
                <Divider sx={{ mb: 3, borderColor: 'rgba(27, 42, 74, 0.05)' }} />
                <Stack spacing={1.2}>
                  {service.bullets.map(b => (
                    <Box key={b} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <CheckCircleIcon sx={{ color: '#7EC845', fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>{b}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Section 2: AI Sourcing Workflow (Step Timeline) ───── */}
      <Box sx={{ mb: 12, bgcolor: alpha('#7EC845', 0.03), borderRadius: 6, p: { xs: 4, md: 8 }, border: '1px solid rgba(126,200,69,0.08)' }}>
        <Typography 
          variant="h3" 
          sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.02em', color: '#1B2A4A', textAlign: 'center' }}
        >
          Our Sourcing Workflow
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ maxWidth: 650, mx: 'auto', textAlign: 'center', mb: 8, lineHeight: 1.7 }}
        >
          How we leverage advanced search indexes and human advisory to shortlist candidates with 98% accuracy.
        </Typography>

        <Grid container spacing={3}>
          {[
            { step: '01', title: 'Role Mapping & Alignment', desc: 'Embedded consultants audit client codebase parameters, structural stack demands, and corporate cultural profiles.' },
            { step: '02', title: 'Semantic Sourcing', desc: 'Our RAG engine cross-references and matches candidate histories in our pre-validated talent pool based on project context.' },
            { step: '03', title: 'Consultancy Verification', desc: 'Expert recruiters conduct psychometric screening and project validation, filtering to a final high-impact shortlist.' },
            { step: '04', title: 'Onboarding & Tracking', desc: 'We mediate contract negotiation, cross-border payroll logistics, and check in regularly to ensure candidate retention.' }
          ].map(s => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.step}>
              <Box 
                sx={{ 
                  bgcolor: '#ffffff', 
                  p: 3.5, 
                  borderRadius: 4, 
                  border: '1px solid rgba(27, 42, 74, 0.05)',
                  height: '100%'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#7EC845', opacity: 0.8, mb: 1.5, fontSize: '2.2rem' }}>
                  {s.step}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#1B2A4A', lineHeight: 1.3 }}>
                  {s.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {s.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Section 3: Engagement Models ───────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.02em', color: '#1B2A4A', textAlign: 'center' }}
        >
          Flexible Partnership Models
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ maxWidth: 650, mx: 'auto', textAlign: 'center', mb: 8, lineHeight: 1.7 }}
        >
          Choose an alignment structure that matches your engineering growth trajectory and ROI goals.
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: 'Success Contingency Placement',
              fee: 'Conforming placement percentage fee',
              desc: 'Best for standard software engineering hires or single direct placements. You only pay a fee upon candidate acceptance. Risk-free, proactive sourcing powered by our active matching databases.',
              primary: false
            },
            {
              title: 'Retained Mandate Advisory',
              fee: 'Dedicated Retained Partnership',
              desc: 'Crucial for executive leadership or sensitive technical roles. Establishes dedicated search hours, comprehensive market intelligence mapping, exhaustive competency screening, and first-priority access.',
              primary: true
            },
            {
              title: 'Embedded RPO Scaling',
              fee: 'Subscription-based embedded talent SLA',
              desc: 'Best for rapidly scaling organizations opening remote tech hubs. We embed a dedicated sourcing consultant and provide high-density campaign tools for end-to-end recruitment pipelines.',
              primary: false
            }
          ].map(model => (
            <Grid size={{ xs: 12, md: 4 }} key={model.title}>
              <Box 
                sx={{ 
                  bgcolor: model.primary ? '#1B2A4A' : '#ffffff',
                  color: model.primary ? '#ffffff' : 'text.primary',
                  p: 4.5,
                  borderRadius: 5,
                  border: '1px solid',
                  borderColor: model.primary ? 'transparent' : 'rgba(27, 42, 74, 0.05)',
                  boxShadow: model.primary ? '0 20px 40px rgba(13, 27, 42, 0.15)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: model.primary ? '#ffffff' : '#1B2A4A' }}>
                  {model.title}
                </Typography>
                <Typography variant="caption" sx={{ color: model.primary ? '#7EC845' : 'primary.main', fontWeight: 700, mb: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {model.fee}
                </Typography>
                <Typography variant="body2" sx={{ color: model.primary ? 'rgba(255,255,255,0.75)' : 'text.secondary', lineHeight: 1.7, mb: 4, flex: 1 }}>
                  {model.desc}
                </Typography>
                <Button 
                  fullWidth
                  variant={model.primary ? 'contained' : 'outlined'}
                  color={model.primary ? 'primary' : 'secondary'}
                  onClick={() => navigate('/login')}
                  sx={{ 
                    borderRadius: 2.5, 
                    py: 1.5,
                    fontWeight: 700,
                    boxShadow: model.primary ? '0 4px 14px rgba(126,200,69,0.3)' : 'none'
                  }}
                >
                  Request Consultation
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PublicPageLayout>
  );
};

export const PricingPage: React.FC = () => (
  <PublicPageLayout title="Partnership Models">
    <Typography variant="body1">We work on contingency, retained, and project-based models depending on the mandate complexity.</Typography>
  </PublicPageLayout>
);
