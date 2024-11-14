import React, { useEffect, useState } from 'react'
import { Box, Flex, Text, Circle, Progress } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

interface ScoreBoxProps {
    score: number | null
    reason: string | null
}

const ScoreBox: React.FC<ScoreBoxProps> = ({ score, reason }) => {
    const [animatedScore, setAnimatedScore] = useState<number>(0)
    const [isVisible, setIsVisible] = useState<boolean>(false)

    useEffect(() => {
        if (score === null) return

        setIsVisible(true)
        const timer = setInterval(() => {
            setAnimatedScore(prev => {
                if (prev < score) {
                    return Math.min(prev + 1, score)
                }
                clearInterval(timer)
                return prev
            })
        }, 20)

        return () => clearInterval(timer)
    }, [score])

    const pulseRing = keyframes`
    0% { transform: scale(0.95) }
    50% { transform: scale(1) }
    100% { transform: scale(0.95) }
  `

    const slideIn = keyframes`
    from { opacity: 0; transform: translateY(20px) }
    to { opacity: 1; transform: translateY(0) }
  `

    const pulseAnimation = `${pulseRing} 2s ease-in-out infinite`
    const slideInAnimation = `${slideIn} 0.6s ease-out`

    if (score === null || !reason) return null

    return (
        <Box
            bg="brand.700"
            borderRadius="xl"
            p={6}
            width="100%"
            maxWidth="500px"
            mx="auto"
            position="relative"
            overflow="hidden"
            animation={slideInAnimation}
            opacity={isVisible ? 1 : 0}
            transform={`translateY(${isVisible ? 0 : '20px'})`}
            transition="all 0.6s ease-out"
        >
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="linear-gradient(165deg, brand.600 0%, transparent 100%)"
                opacity={0.4}
            />

            <Flex direction="column" position="relative" align="center" gap={4}>
                <Circle
                    size="120px"
                    bg="brand.800"
                    border="4px solid"
                    borderColor="brand.50"
                    position="relative"
                    animation={pulseAnimation}
                >
                    <Flex direction="column" align="center">
                        <Text fontSize="3xl" fontWeight="bold" color="brand.50">
                            {animatedScore}%
                        </Text>
                        <Text fontSize="sm" color="brand.200" mt={-1}>
                            Score
                        </Text>
                    </Flex>
                </Circle>

                <Box w="100%" mt={2}>
                    <Progress
                        value={animatedScore}
                        size="sm"
                        borderRadius="full"
                        bg="brand.600"
                        transition="all 0.4s ease-in-out"
                        sx={{
                            '& > div': {
                                background: 'linear-gradient(90deg, brand.200 0%, brand.50 100%)',
                                transition: 'width 0.4s ease-in-out',
                            }
                        }}
                    />
                </Box>

                <Box
                    mt={2}
                    textAlign="center"
                    opacity={isVisible ? 1 : 0}
                    transform={`translateY(${isVisible ? 0 : '10px'})`}
                    transition="all 0.6s ease-out 0.3s"
                >
                    <Text fontSize="sm" color="brand.200" mb={1}>
                        ANALYSIS
                    </Text>
                    <Text fontSize="md" color="brand.50" lineHeight="1.6">
                        {reason}
                    </Text>
                </Box>
            </Flex>
        </Box>
    )
}

export default ScoreBox