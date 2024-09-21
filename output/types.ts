import { z } from 'zod';

export const SchemaRefs: { [key: string]: z.ZodTypeAny } = {};

export const UUIDParamSchema = z.object({
  id: z.string().uuid(),
});
SchemaRefs['UUIDParam'] = UUIDParamSchema;
export type UUIDParam = z.infer<typeof UUIDParamSchema>;

export const AppSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
SchemaRefs['App'] = AppSchema;
export type App = z.infer<typeof AppSchema>;

export const AppInstallationSchema = z.object({
  id: z.string().uuid(),
  appId: z.string().uuid(),
  createdAt: z.string().datetime(),
  externalName: z.string().nullable(),
  connectionStatus: z.enum(['not_connected', 'connecting', 'connected', 'error']),
  storeId: z.string().uuid(),
  updatedAt: z.string().datetime(),
});
SchemaRefs['AppInstallation'] = AppInstallationSchema;
export type AppInstallation = z.infer<typeof AppInstallationSchema>;

export const BundleSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  inboundVariantId: z.string().uuid(),
  redeemableVariants: z.array(
    z.object({
      productId: z.string().uuid(),
      variantId: z.string().uuid(),
      optionId: z.string().uuid(),
      optionValueId: z.string().uuid(),
      name: z.string(),
      mappedName: z.string(),
      colorHex: z.string().nullable(),
      displayType: z.enum(['Buttons', 'Swatches', 'List']),
      group: z.string(),
    }),
  ),
  rebuyMarketplace: z.boolean(),
  redeemText: z.string().min(1),
  selectorType: z.enum(['option', 'variant']),
  shippingOption: z.enum(['all_states', 'lower_48_only']),
  redeemableQuantity: z.number().min(2),
  minimumRedeemableQuantity: z.number().min(1),
  productUrl: z.string().url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
SchemaRefs['Bundle'] = BundleSchema;
export type Bundle = z.infer<typeof BundleSchema>;

export const CreateBundleBodySchema = z.object({
  storeId: z.string().uuid(),
  inboundVariantId: z.string().uuid(),
  redeemableVariants: z.array(
    z.object({
      productId: z.string().uuid(),
      variantId: z.string().uuid(),
      optionId: z.string().uuid(),
      optionValueId: z.string().uuid(),
      name: z.string(),
      mappedName: z.string(),
      colorHex: z.string().nullable(),
      displayType: z.enum(['Buttons', 'Swatches', 'List']),
      group: z.string(),
    }),
  ),
  rebuyMarketplace: z.boolean(),
  redeemText: z.string().min(1),
  selectorType: z.enum(['option', 'variant']),
  shippingOption: z.enum(['all_states', 'lower_48_only']),
  redeemableQuantity: z.number().min(2),
  minimumRedeemableQuantity: z.number().min(1),
  productUrl: z.string().url(),
});
SchemaRefs['CreateBundleBody'] = CreateBundleBodySchema;
export type CreateBundleBody = z.infer<typeof CreateBundleBodySchema>;

export const UpdateBundleBodySchema = z.object({
  id: z.string().uuid().optional(),
  storeId: z.string().uuid().optional(),
  inboundVariantId: z.string().uuid().optional(),
  redeemableVariants: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid(),
        optionId: z.string().uuid(),
        optionValueId: z.string().uuid(),
        name: z.string(),
        mappedName: z.string(),
        colorHex: z.string().nullable(),
        displayType: z.enum(['Buttons', 'Swatches', 'List']),
        group: z.string(),
      }),
    )
    .optional(),
  rebuyMarketplace: z.boolean().optional(),
  redeemText: z.string().min(1).optional(),
  selectorType: z.enum(['option', 'variant']).optional(),
  shippingOption: z.enum(['all_states', 'lower_48_only']).optional(),
  redeemableQuantity: z.number().min(2).optional(),
  minimumRedeemableQuantity: z.number().min(1).optional(),
  productUrl: z.string().url().optional(),
});
SchemaRefs['UpdateBundleBody'] = UpdateBundleBodySchema;
export type UpdateBundleBody = z.infer<typeof UpdateBundleBodySchema>;

export const OptionSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  externalId: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
SchemaRefs['Option'] = OptionSchema;
export type Option = z.infer<typeof OptionSchema>;

export const OptionValueSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  optionId: z.string().uuid(),
  externalId: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
SchemaRefs['OptionValue'] = OptionValueSchema;
export type OptionValue = z.infer<typeof OptionValueSchema>;

export const OrderSchema = z.object({
  name: z.string().nullable().optional(),
  appInstallationId: z.string().uuid().optional(),
  email: z.string().optional(),
  externalId: z.string().nullable().optional(),
  lineItems: z
    .array(
      z.object({
        variantId: z.string().uuid().optional(),
        quantity: z.number().optional(),
      }),
    )
    .optional(),
  id: z.string().uuid().optional(),
});
SchemaRefs['Order'] = OrderSchema;
export type Order = z.infer<typeof OrderSchema>;

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  appInstallationId: z.string().uuid(),
  externalId: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
SchemaRefs['Product'] = ProductSchema;
export type Product = z.infer<typeof ProductSchema>;

export const StoreSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
SchemaRefs['Store'] = StoreSchema;
export type Store = z.infer<typeof StoreSchema>;

export const VariantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  productId: z.string().uuid(),
  externalId: z.string(),
  imageUrl: z.string().url().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
SchemaRefs['Variant'] = VariantSchema;
export type Variant = z.infer<typeof VariantSchema>;

export const VariantOptionValueSchema = z.object({
  id: z.string().uuid(),
  variantId: z.string().uuid(),
  optionValueId: z.string().uuid(),
  externalId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
SchemaRefs['VariantOptionValue'] = VariantOptionValueSchema;
export type VariantOptionValue = z.infer<typeof VariantOptionValueSchema>;

export const AddressSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string().uuid().nullable(),
  name: z.string(),
  address1: z.string(),
  address2: z.string(),
  city: z.string(),
  country: z.string().min(2).max(2),
  stateProvince: z.string().min(2).max(2),
  postalCode: z.string().min(5),
});
SchemaRefs['Address'] = AddressSchema;
export type Address = z.infer<typeof AddressSchema>;

export const VaultItemSchema = z.object({
  id: z.string().uuid(),
  bundleId: z.string().uuid(),
  quantity: z.number(),
  updatedAt: z.string().datetime(),
  shippingOption: z.enum(['all_states', 'lower_48_only']),
  selectorType: z.enum(['option', 'variant']),
  redeemText: z.string(),
  minimumRedeemableQuantity: z.number(),
  productUrl: z.string().url().nullable(),
  inboundVariant: z.object({
    id: z.string().uuid(),
    name: z.string(),
    productId: z.string().uuid(),
    imageUrl: z.string().url().nullable(),
  }),
  rebuyMarketplace: z.boolean(),
  companyName: z.string(),
  redeemableVariants: z.array(
    z.object({
      productId: z.string().uuid(),
      imageUrl: z.string().url().nullable(),
      name: z.string(),
      id: z.string().uuid(),
      variants: z.array(z.lazy(() => VaultVariantSchema)),
    }),
  ),
});
SchemaRefs['VaultItem'] = VaultItemSchema;
export type VaultItem = z.infer<typeof VaultItemSchema>;

export const VaultVariantSchema = z.object({
  name: z.string(),
  group: z.unknown(),
  colorHex: z.string().nullable(),
  optionId: z.string().uuid(),
  variantId: z.string().uuid(),
  displayType: z.enum(['Buttons', 'Swatches', 'List']),
  optionValueId: z.string().uuid(),
  nestedVariants: z.array(z.lazy(() => VaultVariantSchema)),
});
SchemaRefs['VaultVariant'] = VaultVariantSchema;
export type VaultVariant = z.infer<typeof VaultVariantSchema>;

export const UserJwtSchemaSchema = z.object({
  id: z.string().uuid(),
  first: z.string(),
  last: z.string(),
  role: z.enum(['User', 'Admin', 'Support', 'Dev']),
  isCustomer: z.boolean(),
  isMerchant: z.boolean(),
  iat: z.number(),
});
SchemaRefs['UserJwtSchema'] = UserJwtSchemaSchema;
export type UserJwtSchema = z.infer<typeof UserJwtSchemaSchema>;

export const StandardErrorSchema = z.object({
  success: z.boolean().optional(),
  correlationId: z.string().uuid().optional(),
  timestamp: z.string().datetime().optional(),
});
SchemaRefs['StandardError'] = StandardErrorSchema;
export type StandardError = z.infer<typeof StandardErrorSchema>;

export const UserJwtWithEmailSchema = z.object({
  id: z.string().uuid(),
  first: z.string(),
  last: z.string(),
  role: z.enum(['User', 'Admin', 'Support', 'Dev']),
  isCustomer: z.boolean(),
  isMerchant: z.boolean(),
  iat: z.number(),
  email: z.string(),
});
SchemaRefs['UserJwtWithEmail'] = UserJwtWithEmailSchema;
export type UserJwtWithEmail = z.infer<typeof UserJwtWithEmailSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  first: z.string(),
  last: z.string(),
  role: z.enum(['Admin', 'User', 'Support', 'Dev']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
SchemaRefs['User'] = UserSchema;
export type User = z.infer<typeof UserSchema>;
