import {
  Modal,
  Input,
  DatePicker,
  Tag,
  Upload,
  Avatar,
  Select,
  Button,
  Space,
  Divider,
} from "antd";
import {
  PlusOutlined,
  ClockCircleOutlined,
  TagOutlined,
  PictureOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cardDetailSchema,
  type CardDetailFormData,
} from "../../../../schema/cardSchema";
import { useState, useEffect } from "react";
import type { Card } from "../../../../types/column";
import type { UploadFile } from "antd";
import dayjs from "dayjs";
import type { BoardMember, Role } from "../../../../types/board";

const { TextArea } = Input;

interface CardDetailModalProps {
  visible: boolean;
  card: Card | null;
  members: BoardMember[];
  onClose: () => void;
  onUpdate: (updatedCard: Card) => void;
  currentUserRole: Role;
}

const CardDetailModal = ({
  visible,
  card,
  members,
  onClose,
  onUpdate,
}: CardDetailModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CardDetailFormData>({
    resolver: zodResolver(cardDetailSchema),
    defaultValues: {
      title: card?.title || "",
      description: card?.description || "",
      tags: card?.tags || [],
      deadline: card?.deadline || "",
      images: card?.images || [],
      assignees: card?.assignees || [],
    },
  });

  const [newTag, setNewTag] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const tags = watch("tags");
  const images = watch("images");

  useEffect(() => {
    if (card) {
      reset({
        title: card.title,
        description: card.description || "",
        tags: card.tags || [],
        deadline: card.deadline || "",
        images: card.images || [],
        assignees: card.assignees || [],
      });
    }
  }, [card, reset]);

  const onSubmit = (data: CardDetailFormData) => {
    if (!card) return;

    const updatedCard: Card = {
      ...card,
      ...data,
    };

    onUpdate(updatedCard);
    onClose();
  };
  //thêm tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue("tags", [...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  //bỏ tag
  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };
  // thêm ảnh
  const handleImageChange = (info: any) => {
    const newFileList = info.fileList;
    setFileList(newFileList);

    const imageUrls = newFileList.map((file: any) => {
      if (file.originFileObj) {
        return URL.createObjectURL(file.originFileObj);
      }
      return file.url;
    });
    setValue("images", imageUrls);
  };
  //bỏ ảnh
  const handleRemoveImage = (imageUrl: string) => {
    setValue(
      "images",
      images.filter((img) => img !== imageUrl)
    );
    setFileList(
      fileList.filter((file) => {
        const url = file.originFileObj
          ? URL.createObjectURL(file.originFileObj)
          : file.url;
        return url !== imageUrl;
      })
    );
  };

  if (!card) return null;

  return (
    <Modal
      title={
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                {...field}
                variant={"borderless"}
                className="text-xl font-semibold"
                placeholder="Tiêu đề thẻ"
                status={errors.title ? "error" : ""}
              />
              {errors.title && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </div>
              )}
            </div>
          )}
        />
      }
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      width={700}
      okText="Lưu"
      cancelText="Hủy"
    >
      <div className="space-y-4">
        {/* Description */}
        <div>
          <div className="font-medium mb-2">Mô tả</div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <TextArea
                  {...field}
                  placeholder="Thêm mô tả chi tiết..."
                  rows={4}
                  className="w-full"
                  status={errors.description ? "error" : ""}
                />
                {errors.description && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <Divider className="my-4" />

        {/* Tags */}
        <div>
          <div className="font-medium mb-2 flex items-center gap-2">
            <TagOutlined />
            <span>Nhãn</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Tag
                key={tag}
                closable
                onClose={() => handleRemoveTag(tag)}
                color="blue"
              >
                {tag}
              </Tag>
            ))}
          </div>
          <Space.Compact className="w-full">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onPressEnter={handleAddTag}
              placeholder="Thêm nhãn mới..."
            />
            <Button
              type="primary"
              onClick={handleAddTag}
              icon={<PlusOutlined />}
            >
              Thêm
            </Button>
          </Space.Compact>
          {errors.tags && (
            <div className="text-red-500 text-sm mt-1">
              {errors.tags.message}
            </div>
          )}
        </div>

        {/* Deadline */}
        <div>
          <div className="font-medium mb-2 flex items-center gap-2">
            <ClockCircleOutlined />
            <span>Thời hạn</span>
          </div>
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) =>
                  field.onChange(date ? date.toISOString() : "")
                }
                showTime
                format="DD/MM/YYYY HH:mm"
                className="w-full"
                placeholder="Chọn thời hạn"
              />
            )}
          />
        </div>

        {/* Images */}
        <div>
          <div className="font-medium mb-2 flex items-center gap-2">
            <PictureOutlined />
            <span>Hình ảnh</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`preview-${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveImage(image)}
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
          <Upload
            fileList={fileList}
            onChange={handleImageChange}
            listType="picture"
            beforeUpload={() => false}
            accept="image/*"
          >
            <Button icon={<PlusOutlined />}>Tải ảnh lên</Button>
          </Upload>
          {errors.images && (
            <div className="text-red-500 text-sm mt-1">
              {errors.images.message}
            </div>
          )}
        </div>

        {/* Assignees */}
        <div>
          <div className="font-medium mb-2 flex items-center gap-2">
            <UserOutlined />
            <span>Gán cho</span>
          </div>
          <Controller
            name="assignees"
            control={control}
            render={({ field }) => (
              <Select
                mode="multiple"
                {...field}
                placeholder="Chọn thành viên"
                className="w-full"
                options={members.map((member) => ({
                  label: member.email, 
                  value: member.id,
                }))}
              />
            )}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {watch("assignees").map((assignee) => (
              <Avatar key={assignee} className="bg-blue-500">
                {assignee.charAt(0).toUpperCase()}
              </Avatar>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CardDetailModal;
