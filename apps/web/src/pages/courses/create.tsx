import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { withRole } from '@/components/hoc/withAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import {
	ArrowLeft,
	BookOpen,
	Users,
	Clock,
	DollarSign,
	Save,
	Eye,
} from 'lucide-react';
import Link from 'next/link';

// Course form validation schema
const courseSchema = z.object({
	title: z
		.string()
		.min(3, 'Title must be at least 3 characters')
		.max(100, 'Title must be less than 100 characters'),
	description: z
		.string()
		.min(10, 'Description must be at least 10 characters')
		.max(1000, 'Description must be less than 1000 characters'),
	shortDescription: z
		.string()
		.min(10, 'Short description must be at least 10 characters')
		.max(200, 'Short description must be less than 200 characters'),
	category: z.string().min(1, 'Please select a category'),
	level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
	duration: z
		.number()
		.min(1, 'Duration must be at least 1 hour')
		.max(1000, 'Duration must be less than 1000 hours'),
	price: z.number().min(0, 'Price must be 0 or greater'),
	maxStudents: z
		.number()
		.min(1, 'Maximum students must be at least 1')
		.max(10000, 'Maximum students must be less than 10,000'),
	prerequisites: z.string().optional(),
	learningOutcomes: z
		.string()
		.min(10, 'Learning outcomes must be at least 10 characters'),
});

type CourseFormData = z.infer<typeof courseSchema>;

// Mock categories - in real app, these would come from an API
const categories = [
	{ value: 'programming', label: 'Programming' },
	{ value: 'design', label: 'Design' },
	{ value: 'business', label: 'Business' },
	{ value: 'marketing', label: 'Marketing' },
	{ value: 'data-science', label: 'Data Science' },
	{ value: 'cybersecurity', label: 'Cybersecurity' },
];

const levels = [
	{
		value: 'BEGINNER',
		label: 'Beginner',
		description: 'No prior experience required',
	},
	{
		value: 'INTERMEDIATE',
		label: 'Intermediate',
		description: 'Some experience recommended',
	},
	{
		value: 'ADVANCED',
		label: 'Advanced',
		description: 'Extensive experience required',
	},
];

function CreateCoursePage() {
	const { user } = useAuth();
	const notification = useNotification();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [previewMode, setPreviewMode] = useState(false);

	const form = useForm<CourseFormData>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			title: '',
			description: '',
			shortDescription: '',
			category: '',
			level: 'BEGINNER',
			duration: 1,
			price: 0,
			maxStudents: 50,
			prerequisites: '',
			learningOutcomes: '',
		},
	});

	const onSubmit = async (data: CourseFormData) => {
		try {
			setIsLoading(true);
			// In a real app, this would make an API call
			console.log('Creating course:', data);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			notification.success(
				'Course created successfully!',
				'Your course has been created and is ready for content.',
			);
			router.push('/dashboard');
		} catch (error: any) {
			notification.error(
				'Failed to create course',
				error.message || 'An unexpected error occurred.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	const watchedValues = form.watch();

	return (
		<div className='min-h-screen bg-background'>
			<div className='border-b'>
				<div className='container mx-auto px-4 py-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-4'>
							<Button
								variant='ghost'
								size='sm'
								asChild>
								<Link href='/dashboard'>
									<ArrowLeft className='h-4 w-4 mr-2' />
									Back to Dashboard
								</Link>
							</Button>
							<div>
								<h1 className='text-3xl font-bold'>Create New Course</h1>
								<p className='text-muted-foreground'>
									Design and publish your course content
								</p>
							</div>
						</div>
						<div className='flex items-center space-x-2'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setPreviewMode(!previewMode)}>
								<Eye className='h-4 w-4 mr-2' />
								{previewMode ? 'Edit Mode' : 'Preview'}
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Main Form */}
					<div className='lg:col-span-2'>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-8'>
								{/* Basic Information */}
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center'>
											<BookOpen className='h-5 w-5 mr-2' />
											Course Information
										</CardTitle>
										<CardDescription>
											Basic information about your course that students will see
											first.
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-4'>
										<FormField
											control={form.control}
											name='title'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Course Title</FormLabel>
													<FormControl>
														<Input
															placeholder='Enter course title'
															{...field}
														/>
													</FormControl>
													<FormDescription>
														A clear, descriptive title for your course.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='shortDescription'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Short Description</FormLabel>
													<FormControl>
														<Textarea
															placeholder='Brief overview of what students will learn'
															className='min-h-[100px]'
															{...field}
														/>
													</FormControl>
													<FormDescription>
														A concise summary that appears in course listings.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='description'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Full Description</FormLabel>
													<FormControl>
														<Textarea
															placeholder='Detailed description of your course content, structure, and benefits'
															className='min-h-[200px]'
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Detailed course information for the course page.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								{/* Course Details */}
								<Card>
									<CardHeader>
										<CardTitle>Course Details</CardTitle>
										<CardDescription>
											Categorization and learning outcomes for your course.
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<FormField
												control={form.control}
												name='category'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Category</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder='Select a category' />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{categories.map((category) => (
																	<SelectItem
																		key={category.value}
																		value={category.value}>
																		{category.label}
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
												name='level'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Difficulty Level</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder='Select difficulty level' />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{levels.map((level) => (
																	<SelectItem
																		key={level.value}
																		value={level.value}>
																		<div className='flex flex-col'>
																			<span>{level.label}</span>
																			<span className='text-xs text-muted-foreground'>
																				{level.description}
																			</span>
																		</div>
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name='learningOutcomes'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Learning Outcomes</FormLabel>
													<FormControl>
														<Textarea
															placeholder='What will students be able to do after completing this course?'
															className='min-h-[120px]'
															{...field}
														/>
													</FormControl>
													<FormDescription>
														List the key skills and knowledge students will
														gain.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='prerequisites'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Prerequisites (Optional)</FormLabel>
													<FormControl>
														<Textarea
															placeholder='Any required knowledge or skills students should have before taking this course'
															className='min-h-[80px]'
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Leave empty if no prerequisites are required.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								{/* Course Settings */}
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center'>
											<Users className='h-5 w-5 mr-2' />
											Course Settings
										</CardTitle>
										<CardDescription>
											Pricing, capacity, and duration settings.
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
											<FormField
												control={form.control}
												name='duration'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='flex items-center'>
															<Clock className='h-4 w-4 mr-2' />
															Duration (hours)
														</FormLabel>
														<FormControl>
															<Input
																type='number'
																min='1'
																{...field}
																onChange={(e) =>
																	field.onChange(parseInt(e.target.value) || 0)
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name='price'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='flex items-center'>
															<DollarSign className='h-4 w-4 mr-2' />
															Price ($)
														</FormLabel>
														<FormControl>
															<Input
																type='number'
																min='0'
																step='0.01'
																{...field}
																onChange={(e) =>
																	field.onChange(
																		parseFloat(e.target.value) || 0,
																	)
																}
															/>
														</FormControl>
														<FormDescription>
															Set to 0 for free course
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name='maxStudents'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='flex items-center'>
															<Users className='h-4 w-4 mr-2' />
															Max Students
														</FormLabel>
														<FormControl>
															<Input
																type='number'
																min='1'
																{...field}
																onChange={(e) =>
																	field.onChange(parseInt(e.target.value) || 0)
																}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className='flex justify-end space-x-4 pt-6'>
											<Button
												type='button'
												variant='outline'
												onClick={() => router.back()}>
												Cancel
											</Button>
											<Button
												type='submit'
												disabled={isLoading}>
												{isLoading ? (
													<>
														<Save className='h-4 w-4 mr-2 animate-pulse' />
														Creating Course...
													</>
												) : (
													<>
														<Save className='h-4 w-4 mr-2' />
														Create Course
													</>
												)}
											</Button>
										</div>
									</CardContent>
								</Card>
							</form>
						</Form>
					</div>

					<div className='lg:col-span-1'>
						<div className='sticky top-8'>
							<Card>
								<CardHeader>
									<CardTitle>Course Preview</CardTitle>
									<CardDescription>
										How your course will appear to students
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div>
										<h3 className='font-semibold text-lg line-clamp-2'>
											{watchedValues.title || 'Course Title'}
										</h3>
										<p className='text-sm text-muted-foreground mt-1 line-clamp-3'>
											{watchedValues.shortDescription ||
												'Short description will appear here...'}
										</p>
									</div>

									<hr className='border-border' />

									<div className='grid grid-cols-2 gap-4 text-sm'>
										<div className='flex flex-col'>
											<span className='text-muted-foreground'>Category</span>
											<span className='font-medium'>
												{categories.find(
													(c) => c.value === watchedValues.category,
												)?.label || 'Not selected'}
											</span>
										</div>
										<div className='flex flex-col'>
											<span className='text-muted-foreground'>Level</span>
											<Badge
												variant='secondary'
												className='w-fit'>
												{watchedValues.level || 'BEGINNER'}
											</Badge>
										</div>
									</div>

									<hr className='border-border' />

									<div className='grid grid-cols-2 gap-4 text-sm'>
										<div className='flex flex-col'>
											<span className='text-muted-foreground'>Duration</span>
											<span className='font-medium flex items-center'>
												<Clock className='h-3 w-3 mr-1' />
												{watchedValues.duration || 0}h
											</span>
										</div>
										<div className='flex flex-col'>
											<span className='text-muted-foreground'>Price</span>
											<span className='font-medium flex items-center'>
												<DollarSign className='h-3 w-3 mr-1' />
												{watchedValues.price === 0
													? 'Free'
													: `$${watchedValues.price || 0}`}
											</span>
										</div>
									</div>

									<hr className='border-border' />

									<div className='text-sm'>
										<span className='text-muted-foreground'>Max Students</span>
										<div className='flex items-center mt-1'>
											<Users className='h-3 w-3 mr-1' />
											<span className='font-medium'>
												{watchedValues.maxStudents || 0} students
											</span>
										</div>
									</div>

									{watchedValues.prerequisites && (
										<>
											<hr className='border-border' />
											<div className='text-sm'>
												<span className='text-muted-foreground'>
													Prerequisites
												</span>
												<p className='mt-1 text-xs line-clamp-3'>
													{watchedValues.prerequisites}
												</p>
											</div>
										</>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default withRole(CreateCoursePage, [
	'INSTRUCTOR',
	'ADMIN',
	'SUPER_ADMIN',
]);
