// src/pages/movie/ReviewTextArea.tsx
import BaseButton from "@/components/common/BaseButton";
import styled from "styled-components";
import React, {useEffect, useState} from "react";
import BaseTextArea from "@/components/common/BaseTextArea";
import {FormControlLabel, Switch} from "@mui/material";
import {createMovieReview, deleteMovieReview, updateMovieReview} from "@/services/movieDetail";
import Swal from "sweetalert2";
import {Review} from "@/pages/movie/reviewData";

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
    margin: 0 5px 5px 10px;
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
`

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: center;
`

const TextareaButton = styled(BaseButton)`
    height: 30px;
    width: 60px;
    padding: 0;
`

interface ReviewTextAreaProps {
  tmdbId: string;
  onSuccess?: () => void;
  rating: number; // 평점 추가
  isAuthenticated: boolean; // 인증 여부 추가
  myReview?: Review | null; // 수정 모드일 때 기존 리뷰 데이터
}

export const ReviewTextArea = ({tmdbId, onSuccess, rating, isAuthenticated, myReview}: ReviewTextAreaProps) => {
  console.log("[ReviewTextArea] props:", {tmdbId, rating, isAuthenticated, myReview});

  const [value, setValue] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!myReview);

  useEffect(() => {
    console.log("[ReviewTextArea] useEffect myReview:", myReview);
    if (myReview) {
      setValue(myReview.content);
      setIsSpoiler(myReview.isSpoiler);
      setIsEditMode(false);
    } else {
      setValue("");
      setIsSpoiler(false);
      setIsEditMode(true);
    }
  }, [myReview]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 500) {
      setValue(inputValue);
    }
    console.log("[ReviewTextArea] handleChange value:", inputValue);
  };
  const handleSpoilerToggle = () => {
    setIsSpoiler((prev) => !prev);
    console.log("[ReviewTextArea] handleSpoilerToggle:", !isSpoiler);
  };

  const handleSubmit = async () => {
    const trimmed = value.trim();
    console.log("[ReviewTextArea] handleSubmit value:", value, "trimmed:", trimmed);

    if (trimmed.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: '내용을 입력해주세요.',
        confirmButtonText: '확인'
      });
      console.log("[ReviewTextArea] 리뷰 내용이 비어있음");
      return;
    }

    if (trimmed.length < 10) {
      await Swal.fire({
        icon: 'warning',
        title: '리뷰는 최소 10자 이상 작성해주세요.',
        confirmButtonText: '확인'
      });
      console.log("[ReviewTextArea] 리뷰 내용이 너무 짧음:", trimmed.length);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditMode && myReview) {
        // 수정
        console.log("[ReviewTextArea] 리뷰 수정 요청:", {
          reviewId: myReview.reviewId,
          content: value,
          spoiler: isSpoiler,
          star: rating
        });
        await updateMovieReview(
          myReview.reviewId,
          {content: value, spoiler: isSpoiler, star: rating,});
        await Swal.fire({
          icon: 'success',
          title: '리뷰가 수정되었습니다.',
          confirmButtonText: '확인'
        });
      } else {
        console.log("[ReviewTextArea] 리뷰 생성 요청:", {tmdbId, star: rating, content: value, spoiler: isSpoiler});
        await createMovieReview({tmdbId: parseInt(tmdbId), star: Number(rating), content: value, spoiler: isSpoiler});
        await Swal.fire({
          icon: 'success',
          title: '리뷰가 등록되었습니다.',
          confirmButtonText: '확인'
        });
      }
      setIsEditMode(false);
      onSuccess?.(); // 상위에서 리로드 가능
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: '리뷰 등록/수정에 실패했습니다.',
        confirmButtonText: '확인'
      });
      console.error("[ReviewTextArea] 리뷰 등록/수정 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview?.reviewId) return;
    const result = await Swal.fire({
      icon: 'warning',
      title: '리뷰를 삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    });
    if (result.isConfirmed) {
      try {
        await deleteMovieReview(myReview.reviewId);
        await Swal.fire({
          icon: 'success',
          title: '리뷰가 삭제되었습니다.',
          confirmButtonText: '확인'
        });
        onSuccess?.();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: '리뷰 삭제에 실패했습니다.',
          confirmButtonText: '확인'
        });
        console.error("[ReviewTextArea] 리뷰 삭제 실패:", error);
      }
    }
  };

  console.log("[ReviewTextArea] 렌더링 : value:", value, "isSpoiler:", isSpoiler, "isEditMode:", isEditMode);

  return (
    <ReviewInputContainer>
      <ReviewInputTitle>
        {myReview ? isEditMode ? "리뷰 수정" : "내 리뷰"
          : "리뷰 작성"
        }</ReviewInputTitle>
      <ReviewInputForm onSubmit={handleSubmit}>
        <BaseTextArea
          value={isEditMode ? value : myReview?.content ?? ""}
          onChange={isEditMode ? handleChange : undefined}
          maxLength={500}
          placeholder='리뷰를 작성해주세요. (최소 10자, 최대 500자)'
          fullWidth
          readOnly={!isEditMode}
          disabled={!isEditMode}
          style={{
            minHeight: '100px',
            height: 'auto',
            textAlign: 'start',
            alignContent: 'start',
            alignItems: 'start',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            whiteSpace: 'pre-line',
            fontSize: '14px',
          }}/>
        <FormFooter>
          <CharCount>{isEditMode
            ? value.length
            : myReview?.content?.length ?? 0} / 500자</CharCount>
          <ButtonWrapper>
            <FormControlLabel
              control={
                <Switch
                  checked={isEditMode ? isSpoiler : myReview?.isSpoiler ?? false}
                  onChange={isEditMode ? handleSpoilerToggle : undefined}
                  color="warning"
                  disabled={!isEditMode}
                />
              }
              label={<span style={{
                fontSize: '13px',
                fontFamily: 'var(--font-base)',
                fontWeight: 600,
              }}>스포 방지</span>}
            />
            {myReview && (
              <TextareaButton size='small' color='error' onClick={handleDelete}>삭제</TextareaButton>
            )}
            {isEditMode ? (
              <TextareaButton size='small' disabled={isSubmitting} onClick={handleSubmit}>저장</TextareaButton>
            ) : (
              <TextareaButton size='small' onClick={() => {
                setValue(myReview?.content ?? "");
                setIsSpoiler(myReview?.isSpoiler ?? false);
                setIsEditMode(true);
              }}>수정</TextareaButton>
            )}
          </ButtonWrapper>
        </FormFooter>
      </ReviewInputForm>
    </ReviewInputContainer>
  );
}

export default ReviewTextArea;
