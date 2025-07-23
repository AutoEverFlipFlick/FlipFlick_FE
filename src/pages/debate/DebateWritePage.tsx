import React, { useState, useEffect, useRef, useMemo } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/ko'
import styled, { createGlobalStyle } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { createDebate } from '@/services/debate'
import { uploadImage } from '@/services/s3'
import BaseButton from '@/components/common/BaseButton'
import Swal from 'sweetalert2'

const LICENSE_KEY = 'GPL'

const GlobalStyle = createGlobalStyle`
  body { font-family: 'Lato', sans-serif; }
`

const PageWrap = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 10px 16px 40px;
`
const PageTitle = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10px;
`

const TitleInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  border: none;

  padding: 12px 0 12px 8px; // ← 좌측 패딩 추가
  margin-bottom: 20px;
  background-color: rgba(28, 28, 43, 0.6); // 배경 어둡게
  color: #fff;
  &::placeholder {
    color: #aaa;
  }
`

const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`

const EditorWrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  .ck-editor__editable_inline {
    min-height: 400px;
  }
`

const SpoilerToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  justify-content: flex-end;
`

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
`

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.3s;

  &::before {
    position: absolute;
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
  }
`

const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${Slider} {
    background-color: #5025d1;
  }

  &:checked + ${Slider}::before {
    transform: translateX(22px);
  }
`

const SpoilerLabel = styled.span`
  font-size: 14px;
`
const DebateWritePage: React.FC = () => {
  const navigate = useNavigate()
  const editorRef = useRef(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [ready, setReady] = useState(false)
  const [spoiler, setSpoiler] = useState(false)
  const [tmdbId, setTmdbId] = useState<number>(872585)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
    .ck-content {
      font-family: 'Lato', sans-serif;
      line-height: 1.6;
      color: #fff;
      background-color: rgba(28, 28, 43, 0.6) !important;
      
    }

    .ck-content figure.image {
      display: flex;
      width: 50%;
      justify-content: center;
    }

    /* 🔽 CKEditor 툴바 배경 및 버튼 스타일 */
    .ck-toolbar {
      background-color: #1c1c2b !important;
      border: 1px solid #444 !important;
    }

    .ck-toolbar .ck-button {
      color: #eee !important;
    }

    .ck-toolbar .ck-button:hover {
      background-color: #333 !important;
    }

    .ck-toolbar .ck-button.ck-on {
      background-color: #5025d1 !important;
      color: #fff !important;
    }

    .ck.ck-reset_all, .ck.ck-reset_all * {
      box-sizing: border-box;
    }
      .ck.ck-dropdown .ck-dropdown__panel .ck-list__item .ck-button__label {
  color: #000 !important; /* 또는 원하는 밝은 배경이면 #fff */
}

    

  
  `
    document.head.appendChild(style)
    setReady(true)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  function CustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new CustomUploadAdapter(loader)
    }
  }

  class CustomUploadAdapter {
    loader: any
    constructor(loader: any) {
      this.loader = loader
    }

    upload() {
      return this.loader.file.then((file: File) => {
        return uploadImage(file).then((url: string) => ({
          default: url,
        }))
      })
    }

    abort() {}
  }

  const editorConfig = useMemo(() => {
    if (!ready) return null
    return {
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        'imageUpload',
        '|',
        'undo',
        'redo',
      ],
      language: 'ko',
      placeholder: '토론 내용을 입력하세요.',
      licenseKey: LICENSE_KEY,
      extraPlugins: [CustomUploadAdapterPlugin],
      image: {
        toolbar: ['imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight'],
      },
    }
  }, [ready])

  const handleSubmit = () => {
    if (!title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '제목을 입력하세요.',
      })
      return
    }
    if (!content.trim() || content === '<p><br></p>') {
      Swal.fire({
        icon: 'warning',
        title: '내용을 입력하세요.',
      })
      return
    }

    createDebate({
      tmdbId,
      debateTitle: title,
      content,
      spoiler,
    })
      .then(res => {
        navigate(`/debate/${res.data.id}`)
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: '등록 실패',
          text: '잠시 후 다시 시도해 주세요.',
        })
      })
  }

  return (
    <>
      <GlobalStyle />
      <PageWrap>
        <PageTitle>토론장</PageTitle>
        <HeaderActions>
          <BaseButton variant="purple" size="small" onClick={handleSubmit}>
            토론 작성
          </BaseButton>
        </HeaderActions>
        <SpoilerToggleWrapper>
          <SpoilerLabel>스포일러 {spoiler ? '포함됨' : '미포함'}</SpoilerLabel>
          <Switch>
            <Checkbox
              type="checkbox"
              checked={spoiler}
              onChange={() => setSpoiler(prev => !prev)}
            />
            <Slider />
          </Switch>
        </SpoilerToggleWrapper>
        <TitleInput
          placeholder="토론 제목을 입력하세요."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <EditorWrapper ref={editorRef}>
          {editorConfig && (
            <CKEditor
              editor={ClassicEditor as any}
              config={editorConfig}
              data={content}
              onChange={(e, editor) => setContent(editor.getData())}
            />
          )}
        </EditorWrapper>
      </PageWrap>
    </>
  )
}

export default DebateWritePage
