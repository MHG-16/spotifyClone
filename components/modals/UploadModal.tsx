"use client";
import { FieldValues, useForm, UseFormRegister, SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { useState } from "react";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";

import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import Input from "../input/Input";
import Button from "../button/Button";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

interface UploadFormProps {
  onSubmit: any;
  register: UseFormRegister<FieldValues>;
  isLoading: boolean;
};

const UploadForm: React.FC<UploadFormProps> =({
  onSubmit,
  register,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
      <Input 
        id="title"
        disabled={isLoading}
        {...register("title", { required: true })}
        placeholder="Song title"
      />
      <Input 
        id="author"
        disabled={isLoading}
        {...register("author", { required: true })}
        placeholder="Author name"
      />
      <div>
        <div className="pb-2">
          upload a song file in mp3 format 
        </div>
        <Input
          id="song"
          type="file"
          disabled={isLoading}
          {...register("song", { required: true })} 
          accept=".mp3"
        />
      </div>
      <div>
        <div className="pb-2">
          upload a image file
        </div>
        <Input
          id="image"
          type="file"
          disabled={isLoading}
          {...register("image", { required: true })} 
          accept="image/*"
        />
      </div>
      <Button disabled={isLoading} type="submit">
        Create
      </Button>
    </form>
  )
}

const UploadModal = () => {
  const router = useRouter();
  const uploadModal = useUploadModal();
  const [isLoading, setLoading ] = useState(false);
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();

  const {
      register,
      handleSubmit,
      reset
    } = useForm<FieldValues>({
      defaultValues: {
        author: "",
        title: "",
        song: null,
        image: null
      }
  });

  const onSubmit:SubmitHandler<FieldValues> = async (values) => {
    try {
      setLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }
      const uniqId = uniqid();

      const {
        data: songData,
        error: songError
      } = await supabaseClient
        .storage
        .from("songs")
        .upload(`song-${values.title}-${uniqId}`, songFile, {
          cacheControl: "3600",
          upsert: false
        });
      
        if (songError) {
          setLoading(false);
          return toast.error("Failed to upload song");
        }

        // Upload image
        const {
          data: imageData,
          error: imageError
        } = await supabaseClient
          .storage
          .from("images")
          .upload(`image-${values.title}-${uniqId}`, imageFile, {
            cacheControl: "3600",
            upsert: false
          });
        
          if( imageError ) {
            setLoading(false);
            return toast.error("Failed to upload image");
          }

          const {
            error: supabaseError
          } = await supabaseClient
            .from("song")
            .insert({
              user_id: user.id,
              title: values.title,
              author: values.author,
              image_path: imageData.path,
              song_path: songData.path
            });
          
          if( supabaseError) {
            setLoading(false);
            return toast.error("Failed to upload song data");
          }

          router.refresh();
          toast.success("Song uploaded successfully!");
          reset();
          uploadModal.onClose();
    } catch(err) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  const onChange = (open: boolean) => {
    if(!open) {
      reset();
      uploadModal.onClose();
    }
  }
  return (
    <Modal
        title="Add a new song"
        description="Upload an mp3 file"
        isOpen={uploadModal.isOpen}
        onChange={onChange}
    >
        <UploadForm 
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          isLoading={isLoading}
        />
    </Modal>
  )
}

export default UploadModal