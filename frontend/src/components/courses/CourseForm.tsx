import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash2, MoveUp, MoveDown, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MarkdownEditor } from '@/components/ui/markdown-editor';

// Section schema
const sectionSchema = z.object({
  title: z.string().min(3, {
    message: "Section title must be at least 3 characters.",
  }),
  subtitle: z.string().optional(),
  content: z.string().min(10, {
    message: "Section content must be at least 10 characters.",
  }),
  videoUrl: z.string().url({
    message: "Please enter a valid URL for the video.",
  }).optional().or(z.literal('')),
});

// Form schema
const courseFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Course content must be at least 20 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  level: z.string({
    required_error: "Please select a level.",
  }),
  duration: z.string({
    required_error: "Please specify the duration.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid URL for the image.",
  }).optional().or(z.literal('')),
  isFree: z.boolean().default(false),
  price: z.number().min(1).optional(),
  sections: z.array(sectionSchema).min(1, {
    message: "Course must have at least one section.",
  }),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  initialData?: any;
  onSubmit: (values: CourseFormValues) => void;
  categories?: string[];
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData = null, onSubmit, categories = [] }) => {
  const { t } = useTranslation();
  const [coverImagePreview, setCoverImagePreview] = useState(initialData?.imageUrl || '');
  
  // Default categories if none provided from props
  const defaultCategories = [
    "Languages",
    "History",
    "Music",
    "Dance",
    "Literature",
    "Cuisine",
    "Crafts",
    "Art",
    "Religion",
    "Philosophy",
    "Clothing",
  ];
  
  // Use categories from props if available, otherwise use defaults
  const availableCategories = categories.length > 0 ? categories : defaultCategories;
  
  // Form setup
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      sections: initialData.lessons? initialData.lessons?.map(lesson => ({
        title: lesson.title,
        subtitle: '',
        content: lesson.content,
        videoUrl: lesson.videoUrl || '',
      })) : [{
        title: '',
        subtitle: '',
        content: '',
        videoUrl: '',
      }],
    } : {
      title: '',
      description: '',
      category: '',
      level: 'Beginner',
      duration: '',
      imageUrl: '',
      isFree: true,
      price: undefined,
      sections: [{
        title: '',
        subtitle: '',
        content: '',
        videoUrl: '',
      }],
    },
  });
  
  // Field array for sections
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "sections",
  });
  
  // Levels
  const levels = ["Beginner", "Intermediate", "Advanced"];
  
  // Handle form submission
  const handleSubmit = (values: CourseFormValues) => {
    onSubmit(values);
  };
  
  // Handle image preview
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('imageUrl', url);
    setCoverImagePreview(url);
  };
  
  // Move section up
  const moveSectionUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };
  
  // Move section down
  const moveSectionDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('courses.title')}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Swahili" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('courses.courseContent')}</FormLabel>
                  <FormControl>
                    <MarkdownEditor 
                      value={field.value} 
                      onChange={field.onChange} 
                      placeholder="Provide detailed content for your course..."
                      minHeight="300px"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('courses.category')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('courses.level')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('courses.duration')}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 8 weeks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('courses.freeCourse')}
                      </FormLabel>
                      <FormDescription>
                        {t('courses.freeCourseDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {!form.watch("isFree") && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('courses.price')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0.99" 
                          step="0.01"
                          placeholder="e.g., 29.99" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('courses.coverImage')}</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field}
                        onChange={handleImageUrlChange}
                      />
                      <div className="relative aspect-video rounded-md border overflow-hidden">
                        {coverImagePreview ? (
                          <img 
                            src={coverImagePreview} 
                            alt="Cover preview" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <Upload className="h-12 w-12 text-gray-400" />
                            <span className="mt-2 block text-sm text-gray-500">Cover image preview</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t('courses.imageUrlDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Course Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('courses.courseSections')}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: '', subtitle: '', content: '', videoUrl: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('courses.addSection')}
            </Button>
          </div>
          
          <Accordion type="multiple" className="w-full space-y-4">
            {fields.map((field, index) => (
              <AccordionItem key={field.id} value={`section-${index}`} className="border rounded-lg">
                <div className="flex items-center justify-between px-4">
                  <AccordionTrigger>
                    {form.watch(`sections.${index}.title`) || `${t('courses.section')} ${index + 1}`}
                  </AccordionTrigger>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSectionDown(index)}
                      disabled={index === fields.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                
                <AccordionContent className="px-4 pb-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name={`sections.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('courses.sectionTitle')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Introduction to Basics" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`sections.${index}.subtitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('courses.sectionSubtitle')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Learning foundations (optional)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`sections.${index}.videoUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('courses.videoUrl')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., https://www.youtube.com/watch?v=..." />
                          </FormControl>
                          <FormDescription>
                            {t('courses.videoUrlDescription')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`sections.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('courses.sectionContent')}</FormLabel>
                          <FormControl>
                            <MarkdownEditor 
                              value={field.value} 
                              onChange={field.onChange}
                              placeholder="Enter detailed content for this section..."
                              minHeight="200px"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {form.formState.errors.sections?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.sections?.message}
            </p>
          )}
        </div>
        
        <Button type="submit" className="w-full">
          {initialData ? t('courses.updateCourse') : t('courses.createCourse')}
        </Button>
      </form>
    </Form>
  );
};

export default CourseForm;
