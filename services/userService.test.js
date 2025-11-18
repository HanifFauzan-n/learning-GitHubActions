// services/userService.test.js
const userService = require('./userService');
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock semua dependency
jest.mock('../repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('userService - registerUser', () => {

    it('harus berhasil mendaftarkan user baru', async () => {
        const mockName = 'Hanif';
        const mockEmail = 'hanif@example.com';
        const mockPassword = 'password123';
        const mockPasswordHash = 'hashed_password_123';
        const salt = "salt";
        
        // 1. Mock userRepository.findByEmail agar mengembalikan null (email belum dipakai)
        userRepository.findByEmail.mockResolvedValue(null);

        // 2. Mock bcrypt untuk hashing
        bcrypt.genSalt.mockResolvedValue(salt);
        bcrypt.hash.mockResolvedValue(mockPasswordHash);

        // 3. Mock userRepository.create agar mengembalikan user baru
        const mockCreatedUser = { id: 1, name: mockName, email: mockEmail };
        userRepository.create.mockResolvedValue(mockCreatedUser);

        // Jalankan fungsi
        const user = await userService.registerUser(mockName, mockEmail, mockPassword);

        // Verifikasi
        expect(user).toEqual(mockCreatedUser);
        expect(userRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, "salt");
        // expect(userRepository.create).toHaveBeenCalledWith(mockName, mockEmail, mockPasswordHash);
    });

    it('harus gagal jika email sudah ada', async () => {
        // Mock agar email DITEMUKAN
        userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'ada@example.com' });

        // Harapkan error
        await expect(userService.registerUser('Hanif', 'ada@example.com', '123'))
            .rejects
            .toThrow("Email is already in use");
    });
});