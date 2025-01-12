import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CourseHeader from './CourseHeader';
import CourseOutline from './CourseOutline';
import CourseQuestions from './CourseQuestions';
import CourseActions from './CourseActions';
import KeywordsModal from './KeywordsModal';
import SimilarCoursesModal from '../Modals/SimilarCoursesModal';
import { useOutline } from './hooks/useOutline';
import { useCourseNavigation } from './hooks/useCourseNavigation';
import ClinicalCase from '../ClinicalCase';
import AudioModal from '../Modals/AudioModal';
import MindMapModal from '../Modals/MindMapModal';
import ImageModal from '../Modals/ImageModal';
import ChronologyModal from '../Modals/ChronologyModal';

interface CourseContentProps {
  modules: any[];
  selectedModule: string | null;
  selectedChapter: string | null;
  selectedCourse: string | null;
  isDarkMode: boolean;
  onModuleSelect: (moduleId: string, chapterId: string, courseId: string) => void;
  onChapterSelect: (chapterId: string) => void;
  onCourseSelect: (courseId: string) => void;
  showAudio: boolean;
  setShowAudio: (show: boolean) => void;
  isClinicalMode: boolean;
}

const CourseContent: React.FC<CourseContentProps> = ({
  modules,
  selectedModule,
  selectedChapter,
  selectedCourse,
  isDarkMode,
  onModuleSelect,
  onChapterSelect,
  onCourseSelect,
  showAudio,
  setShowAudio,
  isClinicalMode
}) => {
  const course = selectedModule && selectedChapter && selectedCourse
    ? modules
        .find(m => m.id === selectedModule)
        ?.chapters.find(c => c.id === selectedChapter)
        ?.courses.find(c => c.id === selectedCourse)
    : null;

  const {
    showOutline,
    setShowOutline,
    activeSection,
    outlineRef,
    menuButtonRef,
    questionsRef
  } = useOutline();

  const {
    showMindMap,
    setShowMindMap,
    showQuiz,
    setShowQuiz,
    showReferences,
    setShowReferences,
    showVideos,
    setShowVideos,
    showImage,
    setShowImage,
    showChronology,
    setShowChronology
  } = useCourseNavigation();

  const [showKeywords, setShowKeywords] = React.useState(false);
  const [showSimilarCourses, setShowSimilarCourses] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeywordsClick = () => {
    setShowKeywords(true);
  };

  if (!course) return null;

  if (isClinicalMode && course.content?.clinicalMode?.cases) {
    return (
      <div ref={contentRef} className="min-h-screen">
        <CourseOutline
          course={course}
          isDarkMode={isDarkMode}
          showOutline={showOutline}
          setShowOutline={setShowOutline}
          activeSection={activeSection}
          outlineRef={outlineRef}
          menuButtonRef={menuButtonRef}
          questionsRef={questionsRef}
          onKeywordsClick={handleKeywordsClick}
          onSimilarCoursesClick={() => setShowSimilarCourses(true)}
          isClinicalMode={isClinicalMode}
          showVideos={showVideos}
          setShowVideos={setShowVideos}
          showReferences={showReferences}
          setShowReferences={setShowReferences}
        />
        <ClinicalCase
          clinicalCase={course.content.clinicalMode.cases[0]}
          clinicalQuiz={course.content.clinicalMode.clinicalQuiz}
          isDarkMode={isDarkMode}
          onBack={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CourseOutline
        course={course}
        isDarkMode={isDarkMode}
        showOutline={showOutline}
        setShowOutline={setShowOutline}
        activeSection={activeSection}
        outlineRef={outlineRef}
        menuButtonRef={menuButtonRef}
        questionsRef={questionsRef}
        onKeywordsClick={handleKeywordsClick}
        onSimilarCoursesClick={() => setShowSimilarCourses(true)}
        isClinicalMode={isClinicalMode}
        showVideos={showVideos}
        setShowVideos={setShowVideos}
        showReferences={showReferences}
        setShowReferences={setShowReferences}
      />

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 sm:space-y-8"
        >
          <CourseHeader
            course={course}
            isDarkMode={isDarkMode}
            showAudio={showAudio}
            setShowAudio={setShowAudio}
            setShowMindMap={setShowMindMap}
            setShowImage={setShowImage}
            setShowChronology={setShowChronology}
          />

          <CourseQuestions
            course={course}
            isDarkMode={isDarkMode}
            questionsRef={questionsRef}
          />

          <CourseActions
            course={course}
            isDarkMode={isDarkMode}
            showQuiz={showQuiz}
            setShowQuiz={setShowQuiz}
            showReferences={showReferences}
            setShowReferences={setShowReferences}
            showVideos={showVideos}
            setShowVideos={setShowVideos}
            showImage={showImage}
            setShowImage={setShowImage}
          />
        </motion.div>
      </div>

      {/* Modals */}
      <AudioModal
        isOpen={showAudio && !!course.content?.audio}
        onClose={() => setShowAudio(false)}
        isDarkMode={isDarkMode}
        audioUrl={course.content?.audio?.url || ''}
        audioTitle={course.content?.audio?.title || ''}
      />

      <MindMapModal
        isOpen={showMindMap && !!course.content?.mindMap}
        onClose={() => setShowMindMap(false)}
        isDarkMode={isDarkMode}
        mindMap={course.content?.mindMap}
      />

      <ImageModal
        isOpen={showImage && !!course.content?.images}
        onClose={() => setShowImage(false)}
        isDarkMode={isDarkMode}
        imageUrl={course.content?.images?.[0]?.url || ''}
        imageTitle={course.content?.images?.[0]?.title || ''}
        imageDescription={course.content?.images?.[0]?.description || ''}
        images={course.content?.images}
      />

      <ChronologyModal
        isOpen={showChronology}
        onClose={() => setShowChronology(false)}
        isDarkMode={isDarkMode}
        chronology={course.content?.normalMode?.chronology}
      />

      <KeywordsModal
        isOpen={showKeywords}
        onClose={() => setShowKeywords(false)}
        keywords={course.content?.keywords || []}
        isDarkMode={isDarkMode}
      />

      <SimilarCoursesModal
        isOpen={showSimilarCourses}
        onClose={() => setShowSimilarCourses(false)}
        similarCourses={course.content?.similarCourses || []}
        isDarkMode={isDarkMode}
        onCourseSelect={(moduleId, chapterId, courseId) => {
          onModuleSelect(moduleId, chapterId, courseId);
          setShowSimilarCourses(false);
        }}
      />
    </div>
  );
};

export default CourseContent;