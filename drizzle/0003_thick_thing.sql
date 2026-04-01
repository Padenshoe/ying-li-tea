CREATE TABLE `customOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`gender` enum('male','female','other') NOT NULL,
	`phone` varchar(30) NOT NULL,
	`deliveryMethod` enum('home','711') NOT NULL,
	`address` text,
	`storeCode` varchar(255),
	`items` text NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`status` enum('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customOrders_id` PRIMARY KEY(`id`)
);
