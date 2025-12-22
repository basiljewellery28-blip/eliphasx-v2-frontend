import React from 'react';

/**
 * ProgressBar - Shows step completion progress in the Quote Builder
 */
export const ProgressBar = ({ currentStep, totalSteps, steps = [] }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full mb-6">
            {/* Step labels */}
            {steps.length > 0 && (
                <div className="flex justify-between mb-2">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`text-xs font-medium transition-colors ${index < currentStep
                                    ? 'text-green-600'
                                    : index === currentStep
                                        ? 'text-blue-600'
                                        : 'text-gray-400'
                                }`}
                        >
                            {index < currentStep && '✓ '}
                            {step}
                        </div>
                    ))}
                </div>
            )}

            {/* Progress bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Step indicator */}
            <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">
                    Step {currentStep + 1} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-blue-600">
                    {Math.round(progress)}% complete
                </span>
            </div>
        </div>
    );
};

/**
 * SkeletonLoader - Shimmer loading placeholder for content
 */
export const SkeletonLoader = ({
    width = '100%',
    height = '1rem',
    className = '',
    variant = 'text' // 'text', 'circle', 'rectangle', 'card'
}) => {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]';

    const variantClasses = {
        text: 'rounded',
        circle: 'rounded-full',
        rectangle: 'rounded-lg',
        card: 'rounded-xl'
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{ width, height }}
        />
    );
};

/**
 * TableSkeleton - Loading placeholder for tables
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4">
                {Array(columns).fill(0).map((_, i) => (
                    <SkeletonLoader key={`h-${i}`} width="25%" height="1.5rem" />
                ))}
            </div>

            {/* Rows */}
            {Array(rows).fill(0).map((_, rowIndex) => (
                <div key={`r-${rowIndex}`} className="flex gap-4 py-2">
                    {Array(columns).fill(0).map((_, colIndex) => (
                        <SkeletonLoader
                            key={`c-${rowIndex}-${colIndex}`}
                            width="25%"
                            height="1rem"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

/**
 * CardSkeleton - Loading placeholder for cards
 */
export const CardSkeleton = ({ showImage = true }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            {showImage && (
                <SkeletonLoader variant="rectangle" height="150px" />
            )}
            <SkeletonLoader width="60%" height="1.25rem" />
            <SkeletonLoader width="80%" height="1rem" />
            <SkeletonLoader width="40%" height="1rem" />
        </div>
    );
};

/**
 * QuoteBuilderSkeleton - Loading placeholder for the quote builder
 */
export const QuoteBuilderSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Progress bar */}
            <SkeletonLoader height="0.5rem" className="rounded-full" />

            {/* Form sections */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <SkeletonLoader width="40%" height="1.5rem" />
                <div className="grid grid-cols-2 gap-4">
                    <SkeletonLoader height="2.5rem" />
                    <SkeletonLoader height="2.5rem" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <SkeletonLoader height="2.5rem" />
                    <SkeletonLoader height="2.5rem" />
                    <SkeletonLoader height="2.5rem" />
                </div>
            </div>

            {/* Totals card */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                <SkeletonLoader width="30%" height="1.25rem" />
                <SkeletonLoader width="50%" height="2rem" />
            </div>
        </div>
    );
};

export default {
    ProgressBar,
    SkeletonLoader,
    TableSkeleton,
    CardSkeleton,
    QuoteBuilderSkeleton
};
