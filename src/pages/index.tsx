import React, { useState } from 'react'
import {
    Center,
    VStack,
    Text,
    Grid,
    Button,
    Image,
    Flex,
    Spinner,
    useBreakpointValue,
    Box
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ImageIcon } from 'lucide-react'

const MotionBox = motion.create(Box)
const MotionVStack = motion.create(VStack)
import ScoreBox from "@/components/ScoreBox"
import axios from "axios"

export default function Home() {
    const [image1, setImage1] = useState<Blob | null>(null)
    const [image2, setImage2] = useState<Blob | null>(null)
    const [preview1, setPreview1] = useState<string | null>(null)
    const [preview2, setPreview2] = useState<string | null>(null)
    const [score, setScore] = useState<number | null>(null)
    const [reason, setReason] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setImage: React.Dispatch<React.SetStateAction<Blob | null>>,
        setPreview: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(file)
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleProcess = async () => {
        if (!image1 || !image2) return
        const formData = new FormData()
        formData.append('file', image1, 'img1')
        formData.append('file', image2, 'img2')
        setLoading(true)
        const response = await axios.post('/api/process', formData)
        setLoading(false)
        setScore(response.data.score)
        setReason(response.data.reason)
    }

    const buttonSize = useBreakpointValue({base: "sm", md: "md"})
    const imageSize = useBreakpointValue({base: "150px", md: "200px"})

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <Center minH="100vh" py={10} px={4} bg="brand.800">
            <MotionVStack
                spacing={8}
                textAlign="center"
                w="full"
                maxW="2xl"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <MotionBox variants={itemVariants}>
                    <Text
                        fontSize={{ base: "3xl", md: "4xl" }}
                        fontWeight="bold"
                        bgGradient="linear(to-r, brand.200, brand.50)"
                        bgClip="text"
                        letterSpacing="tight"
                    >
                        Are they a bit of you?
                    </Text>
                </MotionBox>

                <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={8}
                    w="full"
                    position="relative"
                >
                    <MotionBox variants={itemVariants}>
                        <VStack spacing={4}>
                            <Box
                                w={imageSize}
                                h={imageSize}
                                borderRadius="xl"
                                overflow="hidden"
                                bg="brand.700"
                                position="relative"
                                transition="transform 0.3s"
                                _hover={{ transform: 'scale(1.02)' }}
                                boxShadow="lg"
                            >
                                {preview1 ? (
                                    <Image
                                        src={preview1}
                                        alt="Your Image"
                                        w="full"
                                        h="full"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <Button
                                        as="label"
                                        htmlFor="upload1"
                                        w="full"
                                        h="full"
                                        bg="transparent"
                                        _hover={{ bg: 'brand.600' }}
                                        cursor="pointer"
                                    >
                                        <VStack spacing={3}>
                                            <ImageIcon size={30} />
                                            <Text>Your picture</Text>
                                        </VStack>
                                        <input
                                            type="file"
                                            id="upload1"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, setImage1, setPreview1)}
                                        />
                                    </Button>
                                )}
                            </Box>
                        </VStack>
                    </MotionBox>

                    <MotionBox variants={itemVariants}>
                        <VStack spacing={4}>
                            <Box
                                w={imageSize}
                                h={imageSize}
                                borderRadius="xl"
                                overflow="hidden"
                                bg="brand.700"
                                position="relative"
                                transition="transform 0.3s"
                                _hover={{ transform: 'scale(1.02)' }}
                                boxShadow="lg"
                            >
                                {preview2 ? (
                                    <Image
                                        src={preview2}
                                        alt="Their Image"
                                        w="full"
                                        h="full"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <Button
                                        as="label"
                                        htmlFor="upload2"
                                        w="full"
                                        h="full"
                                        bg="transparent"
                                        _hover={{ bg: 'brand.600' }}
                                        cursor="pointer"
                                    >
                                        <VStack spacing={3}>
                                            <ImageIcon size={30} />
                                            <Text>Their picture</Text>
                                        </VStack>
                                        <input
                                            type="file"
                                            id="upload2"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, setImage2, setPreview2)}
                                        />
                                    </Button>
                                )}
                            </Box>
                        </VStack>
                    </MotionBox>
                </Grid>

                <MotionBox variants={itemVariants}>
                    <Button
                        onClick={handleProcess}
                        bg="brand.400"
                        color="white"
                        size={buttonSize}
                        w={{ base: "full", md: "auto" }}
                        px={8}
                        h={14}
                        _hover={{
                            bg: "brand.300",
                            transform: "translateY(-2px)",
                        }}
                        _active={{
                            bg: "brand.500",
                            transform: "translateY(0)",
                        }}
                        isDisabled={!image1 || !image2}
                        position="relative"
                        transition="all 0.2s"
                        isLoading={loading}
                        loadingText="Analyzing Chemistry..."
                    >
                        {loading ? (
                            <Flex align="center" gap={2}>
                                <Spinner size="sm" />
                                <Text>Analyzing Chemistry...</Text>
                            </Flex>
                        ) : (
                            <Flex align="center" gap={2}>
                                <Text>Check Compatibility</Text>
                            </Flex>
                        )}
                    </Button>
                </MotionBox>

                <MotionBox variants={itemVariants}>
                    <ScoreBox score={score} reason={reason} />
                </MotionBox>
            </MotionVStack>
        </Center>
    )
}
