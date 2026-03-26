import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import { useState, useEffect } from 'react';

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 11,
    color: '#333',
  },
  header: {
    borderBottom: 2,
    borderColor: '#2563eb',
    paddingBottom: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textTransform: 'uppercase',
    marginBottom: 5,
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 10,
  },
  contactItem: {
    flexDirection: 'row',
    gap: 5,
  },
  mainContent: {
    flexDirection: 'row',
    gap: 15,
  },
  leftColumn: {
    flex: 2,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 10,
    borderLeft: 1,
    borderColor: '#e5e5e5',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
    textTransform: 'uppercase',
    borderBottom: 1,
    borderColor: '#2563eb',
    paddingBottom: 5,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  position: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  period: {
    fontSize: 10,
    color: '#999',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  company: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    color: '#555',
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  educationItem: {
    marginBottom: 10,
  },
  school: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  degree: {
    fontSize: 10,
    color: '#555',
    fontStyle: 'italic',
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginRight: 5,
    marginBottom: 5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageText: {
    fontSize: 10,
    color: '#555',
    lineHeight: 1.6,
  },
});

interface ResumeData {
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    github: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    period: string;
    desc: string;
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    period: string;
  }>;
  skills: string[];
  languages: string;
}

interface ResumePDFProps {
  data: ResumeData;
  themeColor: string;
}

// PDF Document компонент
export const ResumePDF = ({ data, themeColor }: ResumePDFProps) => {
  const themedStyles = StyleSheet.create({
    header: {
      ...styles.header,
      borderColor: themeColor,
    },
    name: {
      ...styles.name,
      color: themeColor,
    },
    title: {
      ...styles.title,
      color: themeColor,
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: themeColor,
      borderColor: themeColor,
    },
    company: {
      ...styles.company,
      color: themeColor,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={themedStyles.header}>
          <Text style={themedStyles.name}>
            {data.personal.fullName || 'YOUR NAME'}
          </Text>
          <Text style={themedStyles.title}>
            {data.personal.title || 'Position'}
          </Text>
          <View style={styles.contactRow}>
            {data.personal.email && (
              <Text style={styles.contactItem}>Email: {data.personal.email}</Text>
            )}
            {data.personal.phone && (
              <Text style={styles.contactItem}>Phone: {data.personal.phone}</Text>
            )}
            {data.personal.location && (
              <Text style={styles.contactItem}>Location: {data.personal.location}</Text>
            )}
            {data.personal.github && (
              <Text style={styles.contactItem}>GitHub: {data.personal.github}</Text>
            )}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Left Column - Experience & Education */}
          <View style={styles.leftColumn}>
            {/* Experience */}
            {data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={themedStyles.sectionTitle}>Work Experience</Text>
                {data.experience.map((exp) => (
                  <View key={exp.id} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.position}>{exp.position}</Text>
                      <Text style={styles.period}>{exp.period}</Text>
                    </View>
                    <Text style={themedStyles.company}>{exp.company}</Text>
                    <Text style={styles.description}>{exp.desc}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={themedStyles.sectionTitle}>Education</Text>
                {data.education.map((edu) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <Text style={styles.school}>{edu.school}</Text>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.period}>{edu.period}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column - Skills & Languages */}
          <View style={styles.rightColumn}>
            {/* Skills */}
            {data.skills.length > 0 && (
              <View style={styles.section}>
                <Text style={themedStyles.sectionTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {data.skills.map((skill, index) => (
                    <Text key={index} style={styles.skillTag}>
                      {skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Languages */}
            {data.languages && (
              <View style={styles.section}>
                <Text style={themedStyles.sectionTitle}>Languages</Text>
                <Text style={styles.languageText}>{data.languages}</Text>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Функція для генерації PDF blob
export const generatePDFBlob = async (data: ResumeData, themeColor: string) => {
  const blob = await pdf(<ResumePDF data={data} themeColor={themeColor} />).toBlob();
  return blob;
};

// Компонент для прев'ю в браузері через iframe з PDF
interface PDFPreviewProps extends ResumePDFProps {
  onPdfReady?: (blobUrl: string) => void;
  scale?: number;
}

export const PDFPreview = ({ data, themeColor, onPdfReady, scale = 75 }: PDFPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    // Debounce PDF generation - wait 500ms after last change
    const timeoutId = setTimeout(async () => {
      try {
        const blob = await generatePDFBlob(data, themeColor);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        onPdfReady?.(url);
      } catch (error) {
        console.error('Failed to generate PDF preview:', error);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [data, themeColor]);

  return (
    <div className="w-full h-full overflow-auto bg-slate-500 p-4 lg:p-8">
      <div 
        className="w-[210mm] min-h-[297mm] bg-white shadow-2xl mx-auto"
        style={{ transform: `scale(${scale / 100})`, transformOrigin: 'top center' }}
      >
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-[297mm] border-0"
            title="PDF Preview"
          />
        ) : (
          <div className="w-full h-[297mm] flex items-center justify-center text-white">
            Generating PDF...
          </div>
        )}
      </div>
    </div>
  );
};
