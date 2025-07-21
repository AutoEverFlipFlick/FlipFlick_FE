// src/pages/movie/ReviewTextArea.tsx
import BaseButton from "@/components/common/BaseButton";
import styled from "styled-components";
import React, {useState} from "react";
import BaseTextArea from "@/components/common/BaseTextArea";
import {FormControlLabel, Switch} from "@mui/material";
import {createMovieReview} from "@/services/movieDetail";
import Swal from "sweetalert2";

const ReviewInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px;
`

const ReviewInputForm = styled.div`
`

const ReviewInputTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
`
const CharCount = styled.div`
    margin-top: 8px;
    font-size: 12px;
    color: #888;
`;

const FormFooter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
`

const ButtonWrapper = styled.div``



interface ReviewTextAreaProps {
  tmdbId: string;
  onSuccess?: () => void;
  rating: number; // 평점 추가
  isAuthenticated: boolean; // 인증 여부 추가
}

export const ReviewTextArea = ({ tmdbId, onSuccess, rating }: ReviewTextAreaProps) => {
  const [value, setValue] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 500) {
      setValue(inputValue);
    }
  };
  const handleSpoilerToggle = () => {
    setIsSpoiler((prev) => !prev);
  };

  const handleSubmit = async () => {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: '내용을 입력해주세요.',
        confirmButtonText: '확인'
      });
      console.log("리뷰 내용이 비어있음");
      return;
    }

    if (trimmed.length < 10) {
      await Swal.fire({
        icon: 'warning',
        title: '리뷰는 최소 10자 이상 작성해주세요.',
        confirmButtonText: '확인'
      });
      console.log("리뷰 내용이 너무 짧음:", trimmed.length);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("리뷰 등록 시도:", { tmdbId, star: rating, content: value, spoiler: isSpoiler });
      await createMovieReview({ tmdbId: parseInt(tmdbId) , star: Number(rating), content: value, spoiler: isSpoiler});
      await Swal.fire({
        icon: 'success',
        title: '리뷰가 등록되었습니다.',
        confirmButtonText: '확인'
      });
      setValue("");
      setIsSpoiler(false);
      onSuccess?.(); // 상위에서 리로드 가능
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: '리뷰 등록에 실패했습니다.',
        confirmButtonText: '확인'
      });

      console.error("리뷰 등록 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <ReviewInputContainer>
      <ReviewInputTitle>리뷰 작성</ReviewInputTitle>
      <ReviewInputForm onSubmit={handleSubmit}>
        <BaseTextArea
          value={value}
          onChange={handleChange}
          maxLength={500}
          placeholder='리뷰를 작성해주세요. (최대 500자)'
          fullWidth
          style={{
            height: '100px',
            textAlign: 'start',
            alignContent: 'start',
            alignItems: 'start',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            whiteSpace: 'pre-line',
          }}/>
        <FormFooter>
          <CharCount>{value.length} / 500자</CharCount>
          <ButtonWrapper>
            <FormControlLabel
              style={{
                backgroundColor: 'transparent',
              }}
              control={
                <Switch
                  checked={isSpoiler}
                  onChange={handleSpoilerToggle}
                  color="warning"
                />
              }
              label="스포 방지"
            />
            {/*onClick={createMovieReview()} 인수를 어떻게 넣지*/}
            {/*<BaseButton size='small' onClick={createMovieReview()}> 저장 </BaseButton>*/}
            <BaseButton size='small' disabled={isSubmitting} onClick={handleSubmit}> 저장 </BaseButton>
          </ButtonWrapper>
        </FormFooter>
      </ReviewInputForm>
    </ReviewInputContainer>
  );
}

export default ReviewTextArea;
